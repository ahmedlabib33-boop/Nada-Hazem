# Nada's Lounge ✦

A cozy, free entertainment hub: movies, series and every social app in one place.
It works on a phone or a laptop, and you can install it like an app.

## What's inside

- **Home**: an animated cartoon portrait of Nada (she blinks, her hair sways, and she winks and says hi when tapped), a greeting, mood picks (cozy, laugh, romance, thrill, spooky, Old Hollywood), *Tonight's pick*, a random *Movie night kit* (snack + vibe + film), and your pinned socials.
- **Watch**:
  - **The free vault**: hand-picked public-domain classics that play right in the app (no ads, no sign-up), hosted by the Internet Archive.
  - **Search anything**: type any movie or series to get
    - classic films you can play in the app, found live on the Internet Archive, and
    - one-tap search on legal free services: Tubi, Pluto TV, The Roku Channel, Plex, YouTube Movies, Shahid (free section), Kanopy and Hoopla (free with a library card), plus JustWatch to see which service has it in your country.
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

Repo → **Settings → Pages** → Source: *Deploy from a branch* → pick the branch and `/ (root)`.
Open the link on your phone and choose **Add to Home Screen** to install it as an app.

## Files

| File | What it does |
|---|---|
| `index.html` | Page layout |
| `css/style.css` | Styles (mobile-first, with a bottom nav on phones) |
| `js/data.js` | Films, services, social platforms, snack and vibe ideas. Edit this to add more. |
| `js/app.js` | App logic |
| `sw.js`, `manifest.webmanifest` | Make it installable and let it open offline |
