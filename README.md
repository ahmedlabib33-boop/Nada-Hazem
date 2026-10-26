# Nada's Lounge ✦

A cozy, free entertainment hub: movies, series and every social app in one place.
It works on a phone or a laptop, and you can install it like an app.

## What's inside

- **Home**: an animated Pixar-style portrait of Nada (glowing frame, slow cinematic zoom, shimmer, sparkles, 3D tilt, and a heart burst with a hello when tapped), a greeting, mood picks (cozy, laugh, romance, thrill, spooky, Old Hollywood), *Tonight's pick*, a random *Movie night kit* (snack + vibe + film), and your pinned socials.
- **Watch**:
  - **The free vault**: hand-picked public-domain classics that play right in the app (no ads, no sign-up), hosted by the Internet Archive.
  - **Search anything**: type any movie or series to get
    - classic films you can play in the app, found live on the Internet Archive, and
    - one-tap search on legal free services: Tubi, Pluto TV, The Roku Channel, Plex, YouTube Movies, Shahid (free section), Kanopy and Hoopla (free with a library card), plus JustWatch to see which service has it in your country.
- **Fashion**: an outfit maker (pick the occasion, weather and vibe to get a full outfit in your best colors, with a "why it works" note and Pinterest ideas), your Warm Autumn color palette, a "what's your style aesthetic?" quiz, a lookbook of saved outfits, and a style tip every day.
- **Beauty**: makeup looks (everyday, no-makeup, office, date night, party, wedding guest, Eid glam) with shades matched to your undertone, eye color and skin. Includes a step-by-step get-ready checklist, an undertone quiz, a winged-liner guide for your eye shape, tutorial links, and a beauty tip every day.
- **Hair & nails** (inside Beauty): 12 hairstyles with step-by-step how-tos filtered by hair length and occasion, plus hair-care tips; nail shapes with advice, 12 polish shades in her palette with a try-on preview, 10 nail designs by occasion, and nail tips.
- **Social**: Instagram, TikTok, Facebook, Snapchat, YouTube, X, Threads, Pinterest, WhatsApp, Telegram, Letterboxd and Spotify. Add your username so each one opens on your profile, and star the ones you want pinned on Home.
- **My List**: a watchlist with hearts. Mark things watched, rate them 1–5 ♥, share them, or tap "Find free" to search every free service at once.
- **Settings** (⚙︎): change the name and the JustWatch country.

Everything is saved on the device in your browser. No account, no tracking, no cost.

> Only free **and legal** sources are included. New Netflix, Disney+ or HBO releases aren't free anywhere legally. When a title is on a free service, the search buttons and JustWatch will find it.

## Run it

It's a plain static site with no build step:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

### Put it online for free (GitHub Pages)

A workflow in `.github/workflows/pages.yml` publishes the app automatically on every push.
After the first push, check **Actions** in the repo. When the "Deploy to GitHub Pages" run is green, the app is at:

**https://ahmedlabib33-boop.github.io/Nada-Hazem/**

If the run fails with a Pages permission error, go to **Settings → Pages** and set *Source* to **GitHub Actions**, then re-run the workflow.

### Install it on an iPhone (no App Store needed)

1. Open the link above in **Safari**.
2. Tap the **Share** button, then **Add to Home Screen**, then **Add**.
3. It gets its own icon and opens full-screen like a normal app. It also works offline.

On Android: open the link in Chrome, tap the **⋮** menu, then **Install app** (or **Add to Home screen**).

### Publish it on the App Store / Google Play

The project is set up with [Capacitor](https://capacitorjs.com), which wraps the web app in a native iOS and Android app.

Requirements: [Node.js](https://nodejs.org). For iOS, a Mac with Xcode and an [Apple Developer account](https://developer.apple.com/programs/) ($99/year). For Android, [Android Studio](https://developer.android.com/studio) and a Google Play developer account ($25 once).

```bash
npm install            # installs Capacitor
npx cap add ios        # once: creates the ios/ project
npx cap add android    # once: creates the android/ project
npm run ios            # builds, syncs and opens Xcode
npm run android        # builds, syncs and opens Android Studio
```

Then in Xcode, pick your team under *Signing & Capabilities*, set the app icon from `icons/icon-1024.png`, and use **Product → Archive** to upload to App Store Connect. In Android Studio use **Build → Generate Signed Bundle** and upload the `.aab` to the Play Console.

The app id is `com.nadahazem.lounge` and the name is "Nada's Lounge" (change both in `capacitor.config.json`).

## Files

| File | What it does |
|---|---|
| `index.html` | Page layout |
| `css/style.css` | Styles (mobile-first, with a bottom nav on phones) |
| `js/data.js` | Films, services, social platforms, snack and vibe ideas. Edit this to add more. |
| `js/app.js` | App logic |
| `sw.js`, `manifest.webmanifest` | Make it installable and let it open offline |
