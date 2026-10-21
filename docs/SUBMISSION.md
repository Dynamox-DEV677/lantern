# Submission draft

> A draft to **rewrite in your own words**. Everything in [square brackets] must come from your real notes and real data. Never fill a bracket from memory or a guess.

## Elevator pitch (1–2 sentences)

When the power goes, Lantern tells you in one tap whether it's just your flat or the whole area, how long cuts here usually last, and whether a neighbour has already called MSEDCL. It works with no network at all, because during a cut the router is dead.

## What is the specific problem, and how do you know it's real?

[From docs/NEIGHBOUR-NOTES.md: what three neighbours actually said, quoted, with times and specifics.]

[What happens on your street when it goes: who shouts, who leans out, who walks down to look.]

Nobody needs an app to know the power is out. What people don't know is whether it's just their flat or the area. That decides whether to check their own MCB board or wait. They also don't know whether anyone has reported it.

## What it does

- One huge button: **Power just went**. One more: **Power's back**. Both work without reading.
- **Three states, never two.**
  - Fewer than 3 phones in the area: "Not enough neighbours yet to tell. Look out of a window."
  - Others out: "[7 of 9] nearby are out — it's the area."
  - Only you: "You *may* be the only one out", then the MCB steps, with the warning not to keep resetting it.
- How long cuts here usually last, from past cuts at the same time of day.
- "Has anyone told MSEDCL?" so five people don't all call, or nobody does.
- My log and my pattern, which work with just one user.
- Marathi first, then Hindi, then English.

## Real use

[N] households in [building/lane] have been logging since [day]. In [N] days we recorded [N] cuts: the shortest was [X] and the longest was [Y]. [N] times it turned out to be only one flat.

(Numbers from `supabase/stats.sql`. Say exactly how many households, even if it is small.)

## How it's built

- Plain JavaScript PWA, about 165 KB, no framework. A service worker caches everything, so it works in aeroplane mode.
- Every tap is saved on the phone first (IndexedDB) and queued; reports are sent when there's a connection.
- Supabase free tier. Tables are locked (RLS on, no policies). The app can only call a few database functions, which return counts, never device ids.
- Times come from the server's clock. Offline reports send "seconds ago", so a phone with the wrong clock can't skew anything.
- Tested with a script that kills the server and uses the app with no network, and an end-to-end test of all three states against the real SQL.
- **AI disclosure:** I built this with Claude Code, an AI coding assistant, which wrote the code from my brief. [Say what you did yourself: the interviews, the design decisions, the Marathi, the testing on real phones, getting neighbours to install it.]

## Accessibility

[Name a real person, e.g. "My neighbour upstairs is 70 and doesn't read English, so the main button has no text on it." Only write this if it is true.]

- The main button is a big icon. Its label sits below it, and screen readers get a full description.
- Colour is never the only signal: out and on differ in words, icon and shape.
- Nothing is smaller than 18 px, every button is at least 64 px, and there are no animations.

## Challenges

The obvious design has two answers: everyone's out, or just you. Before building, I realised that on day one I'd be the only user. A real area-wide blackout would then have confidently told my first neighbour to go and check their MCB in the dark. So it has a three-phone threshold and an "I don't know yet" state. A wrong answer stated confidently is worse than no answer.

Other real ones:
- **Reports that never close.** People tap "Power just went" and then fall asleep. The app asks after 3 hours and closes the report as unknown after 12, and averages only use cuts with a real start and end.
- **Wrong phone clocks.** Fixed by sending "seconds ago" instead of a time.
- **Security without accounts.** A random id can't be checked by database rules, so the tables are locked and only functions can touch them. It still isn't airtight: anyone could invent fake reports. That's fine for one street, but not at a bigger scale.

[Add anything that went wrong when real neighbours used it.]

## What I'd do next

- Get more flats in the lane, so the area signal is reliable.
- Let someone log a cut for a neighbour without a phone.
- Compare logged cuts against what MSEDCL publishes.
