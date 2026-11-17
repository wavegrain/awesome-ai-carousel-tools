<!-- project-header -->
- **Name:** Awesome AI Carousel Tools
- **Cluster:** tools
- **Status:** active
- **What:** public GitHub awesome list of AI carousel and TikTok slideshow tools, each read on its own website (makes, AI, exports, posting, API or MCP, free plan), generated from one data file
- **Live at:** https://github.com/wavegrain/awesome-ai-carousel-tools
- **Deploy:** not deployable; publishing is a push to the public GitHub repo
- **Read first:** `tasks/todo.md`
- **Truth:** origin/main
- **Last verified:** 2026-11-17
<!-- /project-header -->

# Agent instructions

## What this is

A public "awesome" list of AI tools that make social media carousels and slideshows (LinkedIn, Instagram, TikTok), plus open-source projects.
It is option 3 of `~/Documents/code/.scratch/own-directory/PLAN.md`, and it reuses the build, the header style and the README layout of `~/Documents/code/awesome-launch-directories`.
The team behind Wavegrain maintains it, and Wavegrain is one entry like the others.

## Rules

- `data/tools.json` is the only source; `README.md`, `lists/`, `downloads/` and `assets/header-*.svg` are generated.
  Edit the data or `templates/README.md`, then run `npm run build`.
- `npm run check` validates the data and fails when a generated file is stale; run it before every commit.
- `npm run lint` runs awesome-lint, including the `awesome-github` rule that reads the repo's description, topics and license on GitHub.
- Fairness: tables stay A to Z, Wavegrain gets no badge, no top spot and no extra text, and its note is as plain as its competitors'.
  "Maintained by the Wavegrain team" sits only in the footer, and the FAQ says so openly.
- No prices for any tool, Wavegrain included; the build fails on a price pattern.
- Every fact comes from the tool's own site with a read date; anything else is listed in `claimed` with `claimedFrom`.
- Never the owner's personal name; the build fails on a few known private strings, so still read the diff.
- No em dash anywhere; one sentence per line in prose.
- No GitHub Actions (owner rule: no GitHub CI).
- Never push, create the GitHub repo or change its settings without the owner's go.

## Refreshing the data

Re-read each tool's own pages (home, pricing, features, API or MCP docs), update the fields and `read`, and rebuild.
Re-read GitHub stars and last push with `gh api repos/<owner>/<repo>`.
Drop a tool that stopped making carousels; note it in `research/ANALYSIS.md`.

## Social preview

`npm run social` renders `assets/social-preview.png` (1280x640) from `assets/social-preview.html` with headless Chrome.
