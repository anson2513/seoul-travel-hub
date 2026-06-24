# SEOUL Travel Hub Handoff

Date: 2026-06-23
Next session target: 2026-06-24

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

## Not Finished Yet

- Changes have not been committed.
- Changes have not been pushed to GitHub.
- Vercel has not redeployed these local changes.
- Mobile browser visual check was attempted, but the background dev server did not stay reachable.
- Need to restart local preview next time and verify the UI on mobile viewport.

## Next Steps

1. Start local preview:

```text
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
```

2. Open:

```text
http://127.0.0.1:3000
```

3. Verify mobile Home Dashboard:

- Hero spacing
- TravelInfoCard three-section layout
- IT662 flight text
- weather values
- KRW/TWD exchange rate
- emergency `tel:` links
- bottom nav spacing

4. If good, commit and push:

```text
git status
git add .
git commit -m "Build V1.5 home dashboard"
git push
```

5. Check Vercel deployment:

```text
https://seoul-travel-hub.vercel.app/
```

## Notes For Next Session

- Continue from Home Dashboard polish before starting Itinerary.
- Use the approved mockup screenshots as visual direction.
- Do not add attraction/cafe/restaurant photos to `public/images`.
- Future user-uploaded photos should eventually move to Supabase Storage.
