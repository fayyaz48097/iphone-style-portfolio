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
| `VITE_SIRI_API_URL` | your AI endpoint for Siri (empty = answers from local portfolio data) |
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

- **Today** it uses `localAdapter`, which answers from `src/data` (intents in `knowledge.js`) and streams word by word.
- **To connect an AI API**, set `VITE_SIRI_API_URL`. Siri then POSTs `{ messages }` to that URL and accepts either a streamed text body or JSON `{ reply }`. See `httpAdapter.js`.
- Keep model provider keys on your server (for example a serverless function that calls the model). Anything in the browser is public.

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
