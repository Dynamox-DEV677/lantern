-- Numbers for the write-up. Paste into the Supabase SQL editor and run.
-- Times are shown in IST.

-- 1. How many phones use Lantern, per area.
select area_code,
       count(*)                                        as phones,
       count(*) filter (where last_seen >= current_date - 2) as seen_last_2_days
  from public.lantern_devices
 group by area_code
 order by phones desc;

-- 2. Every cut, with reports from different phones merged when they start within 15 minutes.
--    phones_reporting = 1 in an area with 3+ phones is a cut that was probably only that flat.
with r as (
  select o.*,
         went_out_at - lag(went_out_at) over (partition by area_code order by went_out_at) as gap
    from public.lantern_outages o
), c as (
  select r.*,
         sum(case when gap is null or gap > interval '15 minutes' then 1 else 0 end)
           over (partition by area_code order by went_out_at) as cut_no
    from r
)
select area_code,
       cut_no,
       min(went_out_at) at time zone 'Asia/Kolkata'    as started_ist,
       count(distinct device_id)                       as phones_reporting,
       round(percentile_cont(0.5) within group (order by extract(epoch from came_back_at - went_out_at) / 60)
             filter (where came_back_at is not null and not unknown_duration)::numeric, 0) as median_minutes,
       count(*) filter (where unknown_duration)        as reports_with_unknown_end,
       count(*) filter (where called_utility_at is not null) as said_they_called
  from c
 group by area_code, cut_no
 order by started_ist;

-- 3. Shortest and longest finished cut per area (known durations only).
select area_code,
       count(*)                                                    as finished_reports,
       min(came_back_at - went_out_at)                             as shortest,
       max(came_back_at - went_out_at)                             as longest
  from public.lantern_outages
 where came_back_at is not null and not unknown_duration
 group by area_code;
