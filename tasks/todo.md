<!-- now -->
## Now

- **Updated:** 2026-11-17
- **Last done:** 2026-11-17: built the list locally (39 tools, 14 open-source projects), header art, social preview, research; awesome-lint clean except `awesome-github`.
- **In progress:** none.
- **Next:** owner decides whether and where to publish (see "Publish").
- **Blocked:** [decide] publish as `wavegrain/awesome-ai-carousel-tools`? (rec: yes, raised 2026-11-17)
<!-- /now -->

# Plan: Awesome AI Carousel Tools (option 3 of `.scratch/own-directory/PLAN.md`)

Built on 2026-11-17; publishing waits for the owner's go.
Research: [research/ANALYSIS.md](../research/ANALYSIS.md).

## Build

- [x] Research the tools, the existing lists and what searchers ask; write `research/ANALYSIS.md`.
- [x] `data/tools.json`: 39 tools read on their own sites on 2026-11-17, 14 open-source projects from the GitHub API.
- [x] `scripts/build.mjs`: validate the data (no prices, no em dash, claimed facts need a source), generate README, `lists/`, `downloads/` and the header SVGs; `--check` fails when a file is stale.
- [x] Sections: by platform, with scheduling and posting, with an API or MCP server, open source, "How to pick a carousel tool", FAQ.
- [x] Wavegrain as one A to Z entry with no badge; "Maintained by the Wavegrain team" in the footer only; the FAQ says so openly.
- [x] Header art: a carousel of slides from the data, light and dark, CSS animation, reduced motion respected, resting state visible.
- [x] Social preview 1280x640 PNG (`npm run social`).
- [x] Humanizer pass over the template, contributing guide and notes.
- [x] `AGENTS.md` header, `CLAUDE.md` symlink, `projects-index.mjs`, local git commit.
- [x] Rendered locally and checked in light and dark.

## Publish (needs the owner's go)

- [ ] [decide] Publish under `wavegrain/awesome-ai-carousel-tools` (rec: yes, raised 2026-11-17).
- [ ] Create the public repo, push `main`.
- [ ] Description: `AI carousel makers and TikTok slideshow tools compared: LinkedIn carousels, Instagram carousels and TikTok photo slideshows, with AI features, exports, posting, API or MCP, and free plan.`
- [ ] Topics (20): `awesome`, `awesome-list`, `carousel`, `carousel-maker`, `ai-carousel`, `linkedin-carousel`, `instagram-carousel`, `tiktok-slideshow`, `slideshow`, `social-media`, `social-media-marketing`, `content-creation`, `ai-tools`, `linkedin`, `instagram`, `tiktok`, `mcp`, `mcp-server`, `open-source`, `marketing`.
- [ ] [mac] Settings, Social preview: upload `assets/social-preview.png`.
- [ ] Wiki and Projects off; Issues on for corrections.
- [ ] `npm run lint` passes in full after publishing.

## Later

- [ ] Re-read every tool every two or three months; drop tools that stop making carousels.
- [ ] After 30 days: consider a PR to sindresorhus/awesome (generated and AI-assisted lists may be refused).

## Review

- 2026-11-17: `npm run check` passes; awesome-lint 2.3.0 reports only `awesome-github`, which needs the GitHub repo.
- Left out (with reasons in `research/ANALYSIS.md`): pure schedulers, Metricool's agent workflow, tools with no carousel feature, dead or unreadable sites, a stale and a very new GitHub repo, repos with no license.
- Canva, Gamma, Piktochart and VistaCreate blocked automated reading, so some of their fields are marked claimed with the source.
