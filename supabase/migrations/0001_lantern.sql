-- Lantern: power-cut reports for one street.
-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → paste → Run).
-- Safe to run again: everything is "if not exists" / "or replace".
--
-- No accounts. Each phone makes a random 32-hex-character device id and keeps it to itself.
-- Both tables have RLS ON with NO policies, and anon has no table privileges, so nothing
-- can be read or written directly — not even with the public key from the app.
-- Everything goes through the SECURITY DEFINER functions below, which only ever hand back
-- counts and times, never device ids.
--
-- Not airtight: anyone can invent device ids and send fake reports for an area.
-- The README says so.
--
-- All times come from the server's now(). Phones send "seconds ago" instead of a clock
-- time, so a phone with the wrong clock can't skew anything.

create table if not exists public.lantern_outages (
  id                uuid primary key default gen_random_uuid(),
  area_code         text not null check (area_code ~ '^[1-9][0-9]{5}-.+$' and char_length(area_code) <= 67),
  device_id         text not null check (device_id ~ '^[0-9a-f]{32}$'),
  went_out_at       timestamptz not null default now(),
  came_back_at      timestamptz,
  unknown_duration  boolean not null default false,
  called_utility_at timestamptz,
  constraint lantern_back_after_out check (came_back_at is null or came_back_at >= went_out_at)
);

-- One open report per phone, so a stuck button can't spam the table or the count.
create unique index if not exists lantern_one_open_per_device
  on public.lantern_outages (device_id)
  where came_back_at is null and not unknown_duration;

create index if not exists lantern_outages_area_time
  on public.lantern_outages (area_code, went_out_at desc);

-- Which phones use Lantern in an area. A day, not a time: enough to count neighbours.
create table if not exists public.lantern_devices (
  device_id text primary key check (device_id ~ '^[0-9a-f]{32}$'),
  area_code text not null check (area_code ~ '^[1-9][0-9]{5}-.+$' and char_length(area_code) <= 67),
  last_seen date not null default ((now() at time zone 'Asia/Kolkata')::date)
);

create index if not exists lantern_devices_area on public.lantern_devices (area_code, last_seen);

alter table public.lantern_outages enable row level security;
alter table public.lantern_devices enable row level security;
revoke all on table public.lantern_outages from anon, authenticated;
revoke all on table public.lantern_devices from anon, authenticated;

-- Reports left open for 12 hours are closed as unknown. A restore time is never guessed.
create or replace function public.lantern_close_stale()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.lantern_outages
     set unknown_duration = true
   where came_back_at is null
     and not unknown_duration
     and went_out_at < now() - interval '12 hours';
$$;

create or replace function public.lantern_checkin(p_device text, p_area text)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.lantern_devices (device_id, area_code, last_seen)
  values (p_device, p_area, (now() at time zone 'Asia/Kolkata')::date)
  on conflict (device_id) do update
     set area_code = excluded.area_code,
         last_seen = excluded.last_seen;
$$;

create or replace function public.lantern_report_out(p_device text, p_area text, p_seconds_ago integer default 0)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_at   timestamptz := now() - make_interval(secs => least(greatest(coalesce(p_seconds_ago, 0), 0), 43200));
  v_open public.lantern_outages%rowtype;
begin
  perform public.lantern_checkin(p_device, p_area);

  select * into v_open
    from public.lantern_outages
   where device_id = p_device and came_back_at is null and not unknown_duration;

  if found then
    -- The same tap arriving twice (a retry after a lost reply): keep the first.
    if v_open.area_code = p_area and abs(extract(epoch from v_open.went_out_at - v_at)) < 120 then
      return v_open.went_out_at;
    end if;
    -- An older report this phone never closed: its end is unknown, not guessed.
    update public.lantern_outages set unknown_duration = true where id = v_open.id;
  end if;

  insert into public.lantern_outages (area_code, device_id, went_out_at)
  values (p_area, p_device, v_at);
  return v_at;
end;
$$;

create or replace function public.lantern_report_back(p_device text, p_seconds_ago integer default 0, p_unknown boolean default false)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_at timestamptz := now() - make_interval(secs => least(greatest(coalesce(p_seconds_ago, 0), 0), 43200));
begin
  if p_unknown then
    update public.lantern_outages
       set unknown_duration = true
     where device_id = p_device and came_back_at is null and not unknown_duration;
  else
    update public.lantern_outages
       set came_back_at = greatest(went_out_at, v_at)
     where device_id = p_device and came_back_at is null and not unknown_duration;
  end if;
end;
$$;

-- "I've called the electricity board", so five neighbours don't all call — or nobody does.
create or replace function public.lantern_called(p_device text, p_seconds_ago integer default 0)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.lantern_outages
     set called_utility_at = coalesce(
           called_utility_at,
           greatest(went_out_at, now() - make_interval(secs => least(greatest(coalesce(p_seconds_ago, 0), 0), 43200))))
   where device_id = p_device and came_back_at is null and not unknown_duration;
$$;

-- "Tapped by mistake? Undo"
create or replace function public.lantern_cancel(p_device text)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.lantern_outages
   where device_id = p_device and came_back_at is null and not unknown_duration;
$$;

-- "Delete all my data"
create or replace function public.lantern_forget(p_device text)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.lantern_outages where device_id = p_device;
  delete from public.lantern_devices where device_id = p_device;
$$;

-- What the app shows: counts for the area, and past cut times. Never a device id.
--   users        phones in the area seen in the last 14 days (this one included)
--   out          phones with an open report (others only if it started in the last 6 hours —
--                an older open report is more likely someone who forgot to close it)
--   back_recent  other phones whose power came back in the last 15 minutes
--   called_at    latest "I've called" on an open report
--   history      [went_out_at, came_back_at] of finished cuts with a known length, last 90 days
create or replace function public.lantern_area_status(p_device text, p_area text)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_today date := (now() at time zone 'Asia/Kolkata')::date;
  v_out json;
begin
  perform public.lantern_close_stale();

  select json_build_object(
    'users', (
      select count(*) from public.lantern_devices d
       where d.area_code = p_area and d.last_seen >= v_today - 14),
    'me_known', exists (
      select 1 from public.lantern_devices d
       where d.device_id = p_device and d.area_code = p_area and d.last_seen >= v_today - 14),
    'out', (
      select count(distinct o.device_id) from public.lantern_outages o
       where o.area_code = p_area and o.came_back_at is null and not o.unknown_duration
         and (o.went_out_at > now() - interval '6 hours' or o.device_id = p_device)),
    'me_out', exists (
      select 1 from public.lantern_outages o
       where o.device_id = p_device and o.area_code = p_area
         and o.came_back_at is null and not o.unknown_duration),
    'back_recent', (
      select count(distinct o.device_id) from public.lantern_outages o
       where o.area_code = p_area and o.device_id <> p_device
         and o.came_back_at > now() - interval '15 minutes'),
    'called_at', (
      select max(o.called_utility_at) from public.lantern_outages o
       where o.area_code = p_area and o.came_back_at is null and not o.unknown_duration
         and (o.went_out_at > now() - interval '6 hours' or o.device_id = p_device)),
    'history', coalesce((
      select json_agg(json_build_array(h.went_out_at, h.came_back_at) order by h.went_out_at)
        from (select o.went_out_at, o.came_back_at
                from public.lantern_outages o
               where o.area_code = p_area and o.came_back_at is not null and not o.unknown_duration
                 and o.went_out_at > now() - interval '90 days'
               order by o.went_out_at desc
               limit 500) h), '[]'::json)
  ) into v_out;

  return v_out;
end;
$$;

-- Supabase grants EXECUTE on new functions to anon by default. Take it all back,
-- then grant only what the app calls.
revoke all on function public.lantern_close_stale() from public, anon, authenticated;
revoke all on function public.lantern_checkin(text, text) from public, anon, authenticated;
revoke all on function public.lantern_report_out(text, text, integer) from public, anon, authenticated;
revoke all on function public.lantern_report_back(text, integer, boolean) from public, anon, authenticated;
revoke all on function public.lantern_called(text, integer) from public, anon, authenticated;
revoke all on function public.lantern_cancel(text) from public, anon, authenticated;
revoke all on function public.lantern_forget(text) from public, anon, authenticated;
revoke all on function public.lantern_area_status(text, text) from public, anon, authenticated;

grant execute on function public.lantern_checkin(text, text) to anon, authenticated;
grant execute on function public.lantern_report_out(text, text, integer) to anon, authenticated;
grant execute on function public.lantern_report_back(text, integer, boolean) to anon, authenticated;
grant execute on function public.lantern_called(text, integer) to anon, authenticated;
grant execute on function public.lantern_cancel(text) to anon, authenticated;
grant execute on function public.lantern_forget(text) to anon, authenticated;
grant execute on function public.lantern_area_status(text, text) to anon, authenticated;
