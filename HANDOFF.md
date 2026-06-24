# SEOUL Travel Hub Handoff

Date: 2026-06-24
Status: V1.5 Home Dashboard shipped to GitHub and Vercel

## Project Location

The GitHub repo `anson2513/seoul-travel-hub` has been cloned into:

```text
C:\Users\Anson\Documents\韓國自由行
```

## Product Direction

Build toward the approved mobile-first mockups:

- Home Dashboard
- Itinerary
- Expense Tracker
- Photo Map

Use the finalized handoff document as the source of truth for real data.

Priority remains V1.5 Home Dashboard first. Do not start Accounting or Photo Map yet.

## Completed This Session

- Rebuilt broken Chinese text in the Home Dashboard components.
- Reworked `Hero` to match the approved Seoul 2026 app-style direction.
- Rebuilt `TravelInfoCard` as one combined card:
  - Flight
  - Seoul weather
  - KRW/TWD exchange rate
- Added real fixed trip data in `lib/travel-data.ts`.
- Added live data fetching in `lib/live-info.ts`.
- Updated emergency contacts into real phone links:
  - `tel:119`
  - `tel:1330`
  - `tel:+8227381038`
- Reworked `TodaySchedule` with valid Chinese copy and remote images only.
- Reworked `BottomNav` labels and mobile touch sizing.
- Updated metadata to `SEOUL Travel Hub`.
- Removed `next/font/google` so builds do not depend on Google Fonts availability.
- Prevented dark mode from changing the intended light app UI.

## Real Data Currently Used

Outbound flight:

```text
Tigerair Taiwan IT662
2026-10-10
KHH -> GMP
15:55 -> 19:45
```

Return flight is recorded in data but not displayed on Home yet:

```text
Tigerair Taiwan IT662
2026-10-15
GMP -> KHH
20:35 -> 22:40
```

## Live Data Behavior

Weather:

- Uses `OPENWEATHER_API_KEY` when available.
- Falls back to Open-Meteo if no OpenWeather key is configured.
- Displays Seoul temperature, feels-like temperature, rain chance, weather text, icon, and update time.

Exchange:

- Uses `https://open.er-api.com/v6/latest/KRW`.
- Displays `1 KRW = TWD`.

## Verification Done

These passed:

```text
npm.cmd run lint
npm.cmd run build
```

The first build failed because Google Fonts could not be fetched. That was fixed by removing `next/font/google`.

Mobile verification:

- Checked at mobile widths around 375px and 415px.
- No horizontal overflow.
- Hero, IT662 flight data, weather section, KRW/TWD exchange section, schedule preview, emergency links, and bottom nav render correctly.
- `tel:119`, `tel:1330`, and `tel:+8227381038` are present.

Deployment:

- Commit pushed to GitHub: `f6c842e Build V1.5 home dashboard`
- Vercel production URL checked and returned 200:

```text
https://seoul-travel-hub.vercel.app/
```

- Production HTML includes the updated title, Hero, IT662 flight data, weather labels, exchange labels, and emergency phone links.

## Next Steps

1. Open production site on mobile:

```text
https://seoul-travel-hub.vercel.app/
```

2. Visually compare Home against the approved mockup:

- Hero height and text placement
- TravelInfoCard three-section layout
- TodaySchedule spacing and thumbnail balance
- EmergencyCard mobile spacing
- BottomNav spacing

3. If Home is accepted, start Itinerary Page:

- Day 1 to Day 5 tabs
- Timeline sorted by time
- Add itinerary form
- Mobile photo upload from gallery
- Drag sorting later in the iteration

## Notes For Next Session

- Continue from Home Dashboard polish before starting Itinerary.
- Use the approved mockup screenshots as visual direction.
- Do not add attraction/cafe/restaurant photos to `public/images`.
- Future user-uploaded photos should eventually move to Supabase Storage.
