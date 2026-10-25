# Wynn Cortes: Portfolio

A one-page portfolio built with plain HTML, CSS, and JavaScript. No frameworks, no build step, no paid services. It works by opening `index.html` and can be hosted free on GitHub Pages, Vercel, or Firebase Hosting.

## What is inside

| Path | What it does |
| --- | --- |
| `index.html` | All of the content: Home, Projects, About, Skills, Resume, Contact |
| `fonts.css` | The two fonts (Bricolage Grotesque and Instrument Sans), embedded so they also work when you double-click `index.html`. Licenses are in `fonts-licenses/` |
| `style.css` | Colors, fonts, layout, animations. Light and dark colors are at the top (`:root` and `:root[data-theme="dark"]`) |
| `script.js` | Dark/light mode, menu, headline word reveals, scroll reveals, project image parallax, active menu link, resume preview |
| `images/` | `hero.jpg` (profile photo), project screenshots, and the IRIS concept diagram |
| `assets/resume.pdf` | Your resume (used by View, Download, and Preview) |

## Dark and light mode

- The round button in the header switches themes. The sun/moon icon and the accessibility label update automatically.
- Your choice is saved in the browser (`localStorage`), so it stays after refreshing. The first time someone visits, the site follows their device setting.
- How it works: a tiny script in `<head>` sets `data-theme="light"` or `"dark"` on `<html>` before the page paints (no flash). Every color in `style.css` comes from a variable (such as `--paper`, `--ink`, `--accent`), and the dark theme just gives those same variables new values.
- To change a color in one theme only, edit that variable inside the matching block at the top of `style.css`.
- When you add new CSS, use the variables instead of fixed colors like `#fff` so the new parts follow the theme.

## Things still to finish

1. **Skill levels** (Skills section). The levels are samples and are highlighted in yellow. Set each one to what is honestly true for you:
   `data-level` (1, 2, or 3), the level word (Learning, Practicing, Comfortable), and the number of `class="on"` bars. Then remove `class="ph"` from the level word.
2. **LinkedIn**. There is no LinkedIn link yet. When you have a profile, remove the comment marks around the LinkedIn template in the Contact section and in the footer.
3. **Project links**. The case studies say "Links: not available yet." When a project has a GitHub or live link, replace that line with buttons. A ready-made example is in the comment above the project cards in `index.html`.
4. **IRIS screenshot**. IRIS uses a labeled concept diagram because there is nothing built to screenshot. Replace it only when you have a real screenshot.
5. **Yellow placeholder tools**. When everything is final, delete `class="show-placeholders"` from the `<body>` tag and delete the `<button class="ph-toggle">` at the bottom of `index.html`.

## Update content

- **Projects**: each case study is one `<article class="case">` in `index.html`. Copy a whole one to add a project (they alternate left/right automatically). The small pill on the image is the status label.
- **Screenshots**: save the image in `images/` (under about 300 KB, WebP or JPG), then change `src`, `width`, `height`, and `alt` on that card.
- **Resume**: replace `assets/resume.pdf` with a new PDF, keeping the same file name. **View resume** opens it in a new tab, **Download PDF** saves it, and **Preview here** shows it in the page. On many phones the in-page preview cannot show PDFs, so the page offers a button to open it in a new tab instead.
- **Photo**: replace `images/hero.jpg` (square works best) and update the `alt` text on the About photo.
- Match upper and lower case in file names exactly: GitHub Pages treats `Hero.jpg` and `hero.jpg` as different files.

## Animations and effects

Positioning: a front-end student who builds admin and monitoring interfaces on top of PHP/MySQL, with networking and IoT (IRIS) as the direction of growth. Every claim on the page comes from your original content.

- **One page-load sequence:** the headline words slide up out of a clipped line, then the "Where my projects sit in a system" stack builds layer by layer, its connecting lines draw, and one small dot travels each line once. It plays once and stops.
- **Headings:** every section heading reveals with the same word-by-word slide when it scrolls into view.
- **Project images:** a curtain lifts to uncover each image, then the image drifts slightly as you scroll (parallax) and zooms a little on hover. The IRIS diagram is never cropped or zoomed.
- **Interactions:** buttons fill in from the left on hover, text links wipe their underline, a thin bar glides under the current menu link, skill meters fill when visible, scroll progress bar under the header.
- **Themes:** circular reveal when switching light/dark.
- **Accessibility:** all motion turns off for visitors who choose "reduce motion" (`prefers-reduced-motion`). If JavaScript is off, everything is simply visible. No scroll-jacking and no animation libraries: it is plain CSS plus a small amount of JavaScript.
- **Amber** is used only for things that are planned or unfinished (IRIS, sample skill levels).

## Run it on your computer

- **Simplest:** double-click `index.html`.
- **VS Code:** install *Live Preview* (Microsoft), open `index.html`, and use the preview button.

Local addresses such as `127.0.0.1` are for your computer only. They are not the link to submit.

## Publish with GitHub Pages (free)

1. In your GitHub account, create a **Public** repository (for example `portfolio`).
2. Click **Add file > Upload files** and drag in the **contents** of this folder: `index.html`, `style.css`, `script.js`, `images`, and `assets`. Do not upload the ZIP or an extra outer folder.
3. Click **Commit changes** and confirm `index.html` is visible on the repository's main page.
4. Open **Settings > Pages**. Under *Build and deployment*, set **Source** to *Deploy from a branch*, choose branch **main** and folder **/(root)**, then click **Save**.
5. Wait up to about 10 minutes, then return to **Settings > Pages** and click **Visit site**. Your address will normally be `https://YOUR-USERNAME.github.io/portfolio/`.
6. Open that address in a private window and on your phone, and test every link.

**Submit the published `github.io` address**, not the repository address.

To update later: edit your files, upload the changed files to the same repository with the same paths, commit, and wait for publishing to finish.

### Vercel or Firebase

- **Vercel:** import the same GitHub repository. Framework Preset *Other*, no build command, output directory `.`.
- **Firebase Hosting:** put a copy of the site files in a folder named `public`, run `firebase init hosting` (public directory `public`, single-page app *No*, do not overwrite `index.html`), then `firebase deploy --only hosting`.

All paths are relative (`images/...`, `assets/...`), so the site works under `/portfolio/` on GitHub Pages.

## Privacy check before publishing

Everything in `assets/resume.pdf` becomes public once the site is published, including any phone number and home address printed on it. If you would rather not share those, export a web version of your resume without them and use that file instead.

## Checklist before you submit

- [ ] Skill levels are honest, and the yellow placeholder highlights and helper button are removed
- [ ] Every menu link goes to the right section (desktop and phone menu)
- [ ] The theme button works, and your choice is still there after a refresh
- [ ] **View resume** and **Download PDF** open and save the right file
- [ ] Photo and screenshots load, and have real alt text
- [ ] The page works at a narrow browser width and on a real phone
- [ ] The published link opens in a private window without signing in

## Note on tools used

Fill this in for your instructor: which tools helped you (for example, Claude helped review and improve the code), what each one did, and what you changed or checked yourself.

## How it works (for explaining to your instructor)

- **Smooth scrolling:** one CSS rule (`scroll-behavior: smooth`) plus `scroll-padding-top`, so sections stop below the fixed header. There is no JavaScript scrolling code, so nothing can conflict with it.
- **Scroll animations:** `IntersectionObserver` in `script.js` adds an `is-visible` class when an element enters the screen. CSS does the animating.
- **Active menu link:** `script.js` checks which section is near the middle of the screen and marks that link with `aria-current`.
- **Themes:** CSS variables plus the `data-theme` attribute on `<html>` (see "Dark and light mode").
- **Reduced motion:** `prefers-reduced-motion` in `style.css` and `script.js` turns motion off for visitors who ask for that.
- **Skill levels:** honest labels with a three-step meter, not made-up percentages.
