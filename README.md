# 🥎 DiamondHub — Softball Team Hub

Live scoring, player stats, schedules & RSVPs, team chat, dues tracking, and more —
everything a softball team, its parents, and its players need in one place.

**No build step.** Just open `index.html` (or serve the folder) and play ball.

## Features

| Area | What's inside |
|---|---|
| 🏠 Home | Next-game matchup hero, record/streak stat strip, upcoming events, leaders |
| 📻 Scores | Live pitch-by-pitch scorekeeper, play-by-play feed, GameChanger stream links, game history & recaps |
| 📅 Schedule | Upcoming list, month calendar, per-player RSVP, `.ics` export, email invites |
| 📊 Stats | Batting (AVG/OBP/SLG/OPS), pitching (ERA/K/BB), leaderboards, CSV export |
| 👥 Team | Roster with parent contacts + player cards, lineup builder with live field diamond |
| ☰ More | Team chat & announcements, snack/volunteer signups, dues tracker, highlights, practice drill library, settings |
| Multi-team | Unlimited teams with one-tap switching; data auto-saves per device (localStorage) |

## Run it (web)

```bash
# Option 1 — any static server
python3 -m http.server 8080
# then open http://localhost:8080

# Option 2 — npm
npm start
```

Or host it free on **GitHub Pages / Netlify / Vercel** straight from this repo.

## Make it a mobile app

### Path A — Installable PWA (easiest, 2 minutes)
The app already ships with `manifest.webmanifest`, theme colors, and a mobile
bottom-tab layout. Host it over HTTPS, then on a phone use
**Share → Add to Home Screen**. It launches fullscreen like a native app.

### Path B — Native iOS & Android with Capacitor (recommended for app stores)
```bash
npm install
npm run copy:mobile          # copies the web app into www/
npx cap add ios              # once per platform
npx cap add android
npx cap sync                 # after every web change: copy + sync
npx cap open ios             # builds in Xcode
npx cap open android         # builds in Android Studio
```
After each web change, re-run `npm run copy:mobile && npx cap sync`.

## Project structure

```
index.html            App shell (header, score strip, tabs, modals)
styles.css            All styling (ESPN-style strip, bottom tabs, cards)
app.js                All logic + localStorage persistence (no backend needed)
manifest.webmanifest  PWA manifest (installable mobile web app)
capacitor.config.json Capacitor config (native iOS/Android wrapper)
icon.svg              App icon
```

## Data & backups

All data lives in the browser's `localStorage` — no account or server required.
Use **More → Settings → Backup JSON** to export, and Restore to import.

## License

MIT — free for your teams to use and adapt.
