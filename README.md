# Memory Book

A scrapbook style, story driven static site built with Astro and React islands. Six sections (Cover, Lessons, Memories, Photo Gallery with chaptered film strips, Voice Messages on cassette tapes, and a Closing Letter) flow as one continuous scroll with reveal on view animations.

## Stack

- **Astro** for structure (zero JS by default), Content Collections for typed markdown/JSON
- **React** islands for interactive parts only (FilmStrip drag, Lightbox, CassetteCard audio, SignatureReveal)
- **Framer Motion** in islands for drag and reel rotation
- **Plain CSS** with design tokens (no utility framework)
- Self-hosted fonts via `@fontsource` (Caveat, EB Garamond, IBM Plex Mono)

## Commands

| Command         | Action                                       |
| :-------------- | :------------------------------------------- |
| `pnpm dev`      | Start dev server at `localhost:4321`         |
| `pnpm build`    | Build production site to `./dist/`           |
| `pnpm preview`  | Preview the built site locally               |
| `pnpm astro check` | Type-check Astro components & content     |

## Adding content

All content lives in `src/content/`:

- **`cover/cover.md`**: single cover entry (title, dedication, photo)
- **`lessons/NN-*.md`**: one file per lesson; `order` field controls sequence
- **`memories/NN-*.md`**: one file per memory; `era`, `photo`, `photoCaption`, `layout` (left/right/full) all required
- **`gallery/<chapter>.json`**: one chapter per file; each photo has `src`, `caption`, optional `year`/`tape`/`tilt`
- **`voices/NN-*.md`**: title, audio path, duration, side (A/B); transcript is the markdown body
- **`letter/letter.md`**: closing message and sign off line

Photos go in `src/assets/...`, where Astro optimizes them with responsive `srcset`, AVIF/WebP, and blur placeholders.
Audio mp3s go in `public/audio/` (referenced by absolute path in voice frontmatter).

The schema (`src/content.config.ts`) is enforced by Astro's build, so invalid frontmatter fails the build.

## Deploying to Vercel

1. Push to GitHub
2. Import the repo on Vercel (it auto detects as Astro)
3. `vercel.json` adds long cache headers to `/audio/*` and `/_astro/*`
4. Custom subdomain (e.g. `for-mom.<domain>.com`) recommended

## Accessibility

- Body contrast 11.7:1 (AAA), captions 4.6:1 (AA)
- Every memory photo requires a caption (Zod schema enforces it)
- Voice transcripts always rendered in DOM
- Lightbox: focus trap, Escape, arrow keys
- Film strip: arrow buttons + ←/→ keyboard
- `prefers-reduced-motion: reduce` honored everywhere: animations crossfade only, reels stop, signature renders instantly

## Performance

`content-visibility: auto` on every section, `client:visible` / `client:idle` on islands, `preload="metadata"` on audio, Astro `image()` for responsive AVIF/WebP. Targets: LCP < 2.0s on 4G, CLS 0, total JS < 60kB gzipped.

## Future contributions

Family members can edit content via GitHub PRs (one markdown file per lesson/memory/voice). No CMS yet. Add one only when friction is real.
