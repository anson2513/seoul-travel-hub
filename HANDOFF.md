# SEOUL Travel Hub Handoff

Date: 2026-06-26
Status: Home, Itinerary, Accounting, Photo Map, Splash Screen, and PWA install settings are pushed to GitHub/Vercel.

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
- Photo Map numbering was moved from the image overlay to the whitespace below each spot image, using labels like `#01`.

### Splash Screen and Home Screen Icon

Completed and deployed.

- Splash screen appears for about 1.5 seconds before entering the Home dashboard.
- Text:

```text
SEOUL Travel Hub
開發者 by ANSON
```

- Icon and text group are positioned around 42% viewport height.
- The lower line art is based on the actual Home hero mood: cherry blossom branches, N Seoul Tower, sunset, Han River bridge, and city skyline.
- Implementation files:

```text
components/splash/SplashScreen.tsx
app/layout.tsx
```

- Production assets:

```text
public/images/app-icon-black-gold.png
public/images/splash-hero-line-art.png
app/icon.png
app/apple-icon.png
```

### PWA / iPhone Home Screen

Completed on 2026-06-26.

Issue found:

- When the site was added to the iPhone Home Screen, iOS opened it with a browser-style toolbar.
- That toolbar could overlap the app bottom navigation, making Home/Itinerary/Accounting/Photo Map difficult or impossible to tap.

Fix applied:

- Added `app/manifest.ts` with `display: "standalone"`, app name, theme color, scope, start URL, portrait orientation, and app icon.
- Added Apple web app metadata in `app/layout.tsx`.
- Added safe-area bottom spacing to `components/dashboard/BottomNav.tsx`.

Important user testing note:

- On iPhone, delete the old Home Screen shortcut and add the site to Home Screen again after deployment. iOS may keep old shortcut metadata until it is recreated.

## Previous Design Notes

### Splash Screen and Home Screen Icon Notes

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

Home PC update:

- A black/gold app icon concept preview was generated on 2026-06-25 at home.
- The preview image has been copied into the repo at:

```text
public/design-previews/app-icon-concept-black-gold.png
```

- User said they also like this concept.
- Next Codex session can use this image as the reference candidate for the actual app icon and splash screen implementation.

Splash screen final preview:

- User finalized the splash screen preview on 2026-06-25.
- Use this file as the approved visual reference:

```text
public/design-previews/splash-screen-final.png
```

- Keep the icon and text group around 42% viewport height.
- Use real rendered text in the implementation:

```text
SEOUL Travel Hub
開發者 by ANSON
```

- Show the splash screen for about 1.5 seconds before entering the Home dashboard.
- The lower line art should be based on the actual Home hero image: cherry blossom branches, N Seoul Tower, sunset mood, Han River bridge, and city skyline.
- Do not add the previous large pale-gold glow behind the app icon.

## Future Work

Demo video was generated at home on 2026-06-25 using real production app screenshots, not fake/generated UI.

Local output file on the home computer:

```text
C:\Users\ANSON\Documents\Codex\2026-06-25\y\outputs\seoul-travel-hub-intro.mp4
```

Video details:

- 1080x1920 vertical MP4.
- About 1 minute 30 seconds.
- No voiceover.
- Burned-in subtitles.
- Simple transitions.
- Light synthesized background audio.

Covered sections:

- Home dashboard.
- Itinerary editing/navigation.
- Accounting with tax refund reminders.
- Photo Map and recommendation flow.

If the office computer needs the MP4, copy it manually or add it to a separate release/share location. It is not required by the app runtime.

## Development Notes

Commands:

```powershell
pnpm install
node node_modules\next\dist\bin\next dev
node node_modules\eslint\bin\eslint.js <files>
node node_modules\next\dist\bin\next build
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
