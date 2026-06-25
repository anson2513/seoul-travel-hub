# SEOUL Travel Hub Handoff

Date: 2026-06-25
Status: Home, Itinerary, Accounting, and Photo Map are pushed to GitHub/Vercel.

## Repository

GitHub:

```text
anson2513/seoul-travel-hub
```

Production:

```text
https://seoul-travel-hub.vercel.app/
```

Local workspace used at office:

```text
C:\Users\Anson\Documents\韓國自由行
```

## Product Direction

SEOUL Travel Hub is a mobile-first personal travel companion for the Seoul trip:

```text
2026-10-10 to 2026-10-15
Hongdae base
```

It is not a blog or generic travel website. It is intended to be used on the phone during the actual trip.

Core principles:

- Real trip data over demo content.
- Mobile-first layout.
- Local device data for user edits.
- No account system or shared syncing for V1.
- Keep the app smooth and practical.

## Current Feature Status

### Home

Completed and deployed.

- Seoul hero image and clean app-style dashboard.
- Flight card supports outbound/return flight switching.
- Weather can be refreshed manually.
- Exchange rate can be refreshed manually.
- Exchange display is TWD-first.
- Emergency contacts use real phone links.
- Bottom navigation is active.

### Itinerary

Completed and deployed as V1.

- Day 1 to Day 6 trip data is loaded.
- User can add/edit/delete itinerary items.
- User can upload itinerary photos.
- Uploaded photos fit the card image area without distortion.
- Time input auto-formats values like `2230` into `22:30`.
- Sort mode is button-based, not long-press based.
- NAVER Map navigation is used for itinerary navigation.
- Detail panel includes notes, tips, NAVER navigation, and copy address.

Important data fixes already applied:

- DAY1 third item changed to `前往飯店`.
- DAY1 third item has an AREX image.
- DAY6 fifth item has an AREX image.
- DAY6 final arrival item says `抵達小港機場` and uses the airport image.

### Accounting

Completed and deployed as V1.

- Local-device expense records.
- Add/edit/delete expense records.
- TWD and KRW display together.
- Default sample expenses are included for future demo video use.
- Budget and total spend summary.
- Category summary.
- Untaxed/refund-needed list.
- Korea tax refund reminder for KRW 15,000+ purchases.
- Estimated tax refund amount is displayed.
- Tier-based reminder suggests when a purchase is close to a better refund threshold.

### Photo Map

Completed and deployed as V1.1.

- 15 planned photo spots are loaded.
- User can add/edit photo spots.
- User can upload a preset reference image for each spot.
- Spot images now use a compact itinerary-like card layout and do not stretch vertically.
- Tapping a spot opens a full detail panel.
- Detail panel includes large image, NAVER navigation, copy address, completion toggle, notes, tips, and edit action.
- Completion status is stored locally.
- Top route icon opens a lightweight route panel, not a heavy map.
- `推薦拍攝` is visible before the trip and recommends autumn/golden-hour spots.
- During the trip, recommendation logic can highlight time-relevant spots.

## Next Planned Work

### Splash Screen and Home Screen Icon

User selected the iPhone home-screen short name:

```text
韓旅 Hub
```

Approved visual direction:

- Premium black/gold style.
- Custom rounded-square app icon.
- Icon concept: Seoul N Tower + map pin + route line + subtle 2026.
- Keep icon clean enough to read at iPhone home-screen size.
- Splash screen text should be minimal:

```text
SEOUL Travel Hub
開發者 by ANSON
```

Placement note:

- Keep the icon and text group slightly above exact center.
- Recommended visual position is around 42% of viewport height.
- Leave quiet negative space below.
- Do not add extra slogans.

Important: User asked to preview the concept image first before implementing it in the public site.

## Future Work

After the whole app is finalized, create a roughly 1-minute vertical mobile demo video using real app screen recording, not fake/generated UI.

The demo should highlight:

- Home dashboard.
- Itinerary editing/navigation.
- Accounting with tax refund reminders.
- Photo Map and recommendation flow.

Preferred format:

```text
1080x1920 vertical
```

## Development Notes

Commands:

```powershell
npm install
npm run dev
npm run lint
npm run build
```

Local dev URL:

```text
http://localhost:3000
```

Before coding with this Next.js version, read relevant files under:

```text
node_modules\next\dist\docs\
```

This is required by `AGENTS.md`.
