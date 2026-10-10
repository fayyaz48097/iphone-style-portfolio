# fayyaz-portfolio

Fayyaz Ali's portfolio, styled as an iOS device with Liquid Glass surfaces, a Dynamic Island, a lock-screen hero, a home screen, notifications, iMessage, a Control Centre and a terminal.

Built with React 19, Vite 8 and Tailwind CSS 4.

## Scripts

```bash
npm install
npm run dev      # dev server (port from VITE_PORT)
npm run build    # production build to dist/
npm run preview  # serve the production build
npm run lint     # oxlint
```

## Environment

Copy `.env.example` to `.env` and fill it in. Every variable is read in one place, `src/config/env.js`.

| Variable | Used for |
| --- | --- |
| `VITE_CONTACT_EMAIL` | mailto links, copy email, terminal, chat hand-off |
| `VITE_CONTACT_PHONE` | the Call button and the terminal's `contact` command |
| `VITE_SIRI_API_URL` | Siri's AI endpoint, `/api/siri/chat` (empty = offline keyword Siri only) |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | server-only Gemini settings for Siri |
| `VITE_FIREBASE_*` | Firebase web config: Realtime Database and Analytics (see Firebase below) |
| `VITE_APP_NAME`, `VITE_APP_URL`, `VITE_PORT` | app metadata and the dev server port |

`VITE_` variables are bundled into the client, so never put secrets in them.

## Project structure

```
src/
  app/            AppProviders, which composes every context provider
  pages/          HomePage, which lists the sections in order
  layouts/        DeviceLayout: wallpaper and system chrome around the page
  sections/       one folder per page section (component + CSS + section-only hooks)
  components/
    ui/           reusable primitives: Glass, Reveal, AppIcon, Pill, GroupList, ActionButton...
    layout/       Section/Container, Wallpaper, LiquidFilter, Footer
    system/       iOS chrome: DynamicIsland, TabBar, Siri, ControlCentre, Terminal, PointerFollower
    icons/        SF Symbols-style SVG icons
  providers/      settings (theme, tint, motion), island, confetti, overlay contexts
  services/       external integrations (siri: pluggable AI adapters)
  hooks/          generic hooks (useEventListener, useInView, useMediaQuery, useSpeechRecognition...)
  lib/            framework-free helpers (cn, storage, links, clipboard, confetti engine...)
  data/           all content: profile, projects, experience, skills, education...
  constants/      storage keys, section ids, durations
  styles/         design tokens, base, Liquid Glass material, motion rules
```

### Conventions

- **Content lives in `src/data/`.** To add a project, job, skill or certificate, edit the matching data file. No component changes are needed.
- **CSS uses BEM class names** (`block__element--modifier`), and each stylesheet sits next to its component. Component styles go in `@layer components`, so Tailwind utilities can still override them.
- **Design tokens** live in `styles/tokens.css` and are exposed to Tailwind (`text-fg-muted`, `bg-fill`, `font-mono`...).
- **The glass material** is the `.glass` class. Use `<Glass>` or the `glass()` class helper; `glass({ lens: true })` adds SVG refraction in Chromium.
- **Scroll reveals** use `<Reveal as="..." delay={0.1}>`.
- **Feedback** comes from `useAppActions()`, which wraps theme, motion, copy email and hire with island notifications and confetti. To show a custom notification, call `useIsland().notify({...})`.
- **Accessibility:** every animation respects `prefers-reduced-motion` and the Control Centre motion switch.

## Siri

The orb in the bottom-right corner opens Siri. Tap it to type, or press and hold it to talk. Voice uses the Web Speech API (Chrome, Edge and Safari), and spoken questions get spoken answers.

The UI lives in `src/components/system/Siri/`. The "brain" lives in `src/services/siri/` behind one adapter contract:

```js
// resolves with the full reply, streaming pieces through onToken
adapter.ask({ messages, signal, onToken }) // messages: [{ role: 'user' | 'assistant', content }]
```

- **The AI brain** is Gemini, behind the Vercel function `api/siri/chat.js`. `VITE_SIRI_API_URL=/api/siri/chat` points Siri at it.
  - The key (`GEMINI_API_KEY`) and model (`GEMINI_MODEL`, default `gemini-flash-lite-latest`) are server-only env vars.
  - The system prompt (`api/_lib/siriPrompt.js`) is built from `resume/resume.data.mjs`, so Siri knows what the CV says.
  - Siri answers only about Fayyaz and always introduces itself as *Siri, developed by Fayyaz Ali*.
- **The offline backup** is `localAdapter`. It uses keyword intents from `src/data` (`knowledge.js`). `fallbackAdapter.js` switches to it automatically when the AI fails: no key, quota reached, timeout, server error or an empty reply. After a quota or server error the AI is skipped for 5 minutes.
- **Quota protection** in the function covers message and history size limits, a cap on answer length, roughly 20 questions per 10 minutes per visitor, and a same-site origin check.

## Firebase

The config is read from `VITE_FIREBASE_*` in `.env` and never written in code. Copy the values from Firebase console › Project settings › Your apps, and add the same variables to your hosting provider's environment settings.

```js
import { readOnce, subscribe, write, pushChild, increment } from '@/services/firebase'
import { useRealtimeValue } from '@/hooks/useRealtimeValue'

const { data, loading, error } = useRealtimeValue('stats/views') // live in React
```

- **Lazy loading.** Every SDK loads on demand, so the first page load stays light. Analytics starts after the page is idle, in production builds only.
- **Security.** A Firebase web config is not a secret. It ends up in the browser bundle of any site that uses Firebase. Keeping it in `.env` keeps it out of the repository, but real protection comes from:
  - Realtime Database rules (the database is currently fully locked),
  - restricting the API key to your domains in Google Cloud console › Credentials,
  - optionally, App Check.

## Live chat

Visitors chat from the contact section, and Fayyaz answers from `/admin`. The chat runs on the Firebase Spark (free) plan plus Vercel Hobby (free) functions, with Gmail for email.

- **Visitors** get a silent anonymous Firebase account. The same browser keeps the same conversation. An optional email is requested when Fayyaz is away or hasn't answered within 2 minutes.
- **`/admin`** uses Google sign-in, and only uids listed under `admins/` get in. It has an Available / Busy / Away switch, sets you to away automatically after 5 idle minutes or when the tab is hidden, and shows unread badges and browser alerts.
- **`api/chat/notify`** emails Fayyaz about new messages: at most one per conversation every 5 minutes, and none while he's online.
- **`api/chat/reply`** emails the visitor the reply when they're offline. The email contains a *Continue the chat* link that reopens the conversation on any device.
- **Security** comes from `database.rules.json`, which the functions also go through: they call the database with the caller's own token, so no service account is needed.

Server-only env vars (`MAIL_*`, `CHAT_NOTIFY_TO`, `SITE_URL`) have no `VITE_` prefix, so they never reach the browser. `npm run dev` and `npm run preview` serve `/api` locally through `scripts/vite-local-api.mjs`.

**Testing locally against the emulators** (needs Java 11+):

```bash
npm run emulators   # auth + database emulators with database.rules.json
```

Then build or run the app with `VITE_FIREBASE_EMULATORS=true`, and give the API these server variables: `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`, `FIREBASE_DATABASE_EMULATOR_HOST=127.0.0.1:9000` and `FIREBASE_PROJECT_ID=demo-portfolio`.

## SEO

Link-preview robots (LinkedIn, WhatsApp, X, Facebook) don't run JavaScript, so the important tags are written into `index.html` at build time by `scripts/vite-seo.mjs`, using `seo.config.mjs` and `resume/resume.data.mjs`:

- title, description, keywords, canonical URL, robots and theme colours
- Open Graph and Twitter card tags, with a 1200×630 preview image (`public/og-image.png`, rebuilt with `npm run og`)
- JSON-LD structured data: `Person`, `WebSite` and `ProfilePage`
- a `<noscript>` text version of the profile
- `robots.txt` and `sitemap.xml`, generated into the build

At runtime, `<Seo>` (react-helmet-async) handles per-page titles and `noindex` for private pages such as `/admin`.

Set `VITE_SITE_URL` to the live domain. It's needed for absolute URLs and the sitemap. On Vercel it falls back to the production domain automatically.

## Icons

`npm run icons` crops the face from `public/fayyaz_avatar.jpg` (local source artwork, git-ignored) into the favicon, the Apple touch icon and the web-app manifest icons in `public/icons/`.

## Résumé

The CV is generated, not hand-edited. Its content lives in `resume/resume.data.mjs` and its layout in `resume/template.mjs`.

```bash
npm run resume   # needs Google Chrome installed (or set CHROME_PATH)
```

This writes:

- `public/resume/Fayyaz_Ali_Backend_Resume.pdf`, the public download. References say "available upon request".
- `public/resume/resume-preview.jpg`, the page preview shown in the Résumé sheet.
- `src/data/resume.meta.json`, with the page count, size and date the sheet displays.
- `resume/output/…_with_references.pdf`, a private copy built from `resume/references.local.json`. Both files are git-ignored, so the references' phone numbers never reach the public repo or site.

Visitors open the Résumé sheet from the document widget on the lock screen, the Résumé button in the contact section, the `resume` / `cv` terminal command, or by asking Siri.

## Easter eggs

- Press `/` or `Ctrl/Cmd + K` to open the terminal.
- Press and hold a home-screen icon.
- Enter the Konami code.
