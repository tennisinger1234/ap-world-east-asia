# East Asia, c. 1200–1450 — AP World History Topic 1.1 Study Guide

A Song-focused study guide organized by PIRATES, built with React, Vite, and Tailwind. It has four sections: **Learn** (the 7 PIRATES categories with progress tracking, Japan/Korea/Vietnam, and a timeline), **Connections** (cause/effect chains and Song → Yuan → Ming continuity and change), **Practice** (multiple choice, SAQ, flashcards, Sort it, Timeline order, and Continuity or change?), and **Sources** (Chicago bibliography). A search box finds any term. The **Home** dashboard shows a progress ring, quiz average, flashcards mastered, categories completed, and SAQs attempted, saved in the browser's localStorage. An original cartoon mascot (a Song scholar-official) and SVG PIRATES icons are in `src/components/Mascot.jsx` and `src/components/Illustrations.jsx`. Historical photos are public domain or openly licensed, stored in `src/assets/photos/`, and credited under each image and on the Sources page.

## Editing content

**All historical content lives in [`src/data/content.json`](src/data/content.json).** Components contain no facts.

| Section | What it controls |
|---|---|
| `items` | PIRATES cards, flashcards, search, and dated timeline entries. Each has `id, category, focus, title, date, summary, globalConnection, connectionType, sourceIds, verified`, plus optional `era`, `year` (for the timeline), `region`, `locators` (e.g. `{"slides": "slide 9"}`), and `background` (pre-1200). `focus` is `"song"` (main cards), `"neighbors"` (Japan/Korea/Vietnam), or `"context"` (Yuan/Ming, shown compactly and on Connections). |
| `eras` | The Northern Song → Southern Song → Yuan → Ming band on the Learn page |
| `overview` | Learn page overview cards (`group`: `song`, `neighbors`, `context`) |
| `chains` | Cause → effect chains on Connections |
| `continuityChange` | Song / Yuan / Ming table |
| `neighbors` | Japan, Korea & Vietnam: adopted vs. adapted |
| `timelineEvents` | Dated events that aren't full cards |
| `practice.mcq` | Multiple choice: a `stimulus` (`quote` with attribution and sourceIds, or `description`), 4 `choices`, `answer` (0-based index), `explanation`, `itemIds` |
| `practice.saq` | SAQ prompts: optional `stimulus`, and `parts` a/b/c, each with `prompt`, model answer `points`, and `itemIds` |
| `practice.ccot` | Continuity-or-change examples: `text`, `answer` (`"continuity"` or `"change"`), `explanation`, `itemIds` |
| `photos` | Historical photos: `file` (in `src/assets/photos/`), `itemId` or `society` (where it appears), `alt`, `caption`, `sourceId` (its Chicago credit in `sources`, with `kind: "image"`). |
| `sources` | Chicago `note`, `shortNote`, and `bibliography` text. `{loc}` in a note is replaced by the item's locator. `*text*` renders in italics. |

After editing, run `npm run check-content` (validation) and `npm run verify-report` (lists practice questions that rely on unverified developments). `check-content` fails if a category has fewer than 3 in-period or Song-focused developments, a `sourceId` doesn't exist, a `connectionType` is misspelled, and so on.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173/ap-world-east-asia/
```

## Deploy to GitHub Pages

The repo includes a GitHub Actions workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) that validates the content, builds the site, and publishes it every time you push to `main`.

1. **Create the repo.** On GitHub, create a new repository named **`ap-world-east-asia`** (the name must match `base` in [vite.config.js](vite.config.js)). Don't add a README or .gitignore.
2. **Push the code** from this folder:
   ```bash
   git init
   git add .
   git commit -m "AP World 1.1 study guide"
   git branch -M main
   git remote add origin https://github.com/<your-username>/ap-world-east-asia.git
   git push -u origin main
   ```
3. **Turn on Pages.** In the repo, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
4. **Wait for the build.** Open the **Actions** tab and wait for "Deploy to GitHub Pages" to show a green check (about 1 minute). If it ran before you changed the Pages setting, click the run and choose **Re-run all jobs**.
5. **Visit the site** at `https://<your-username>.github.io/ap-world-east-asia/`.

Every later `git push` redeploys automatically.

**If you use a different repo name,** change `base: '/ap-world-east-asia/'` in `vite.config.js` to `'/<your-repo-name>/'`.

The app uses hash-based URLs (e.g. `…/#/timeline`), so links to any page work on GitHub Pages without extra setup.

The teacher's slides (`sources/`) and fact-check notes (`VERIFY.md`) are listed in `.gitignore`, so they stay on your computer and are never uploaded.
