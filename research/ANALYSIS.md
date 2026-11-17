# Analysis: AI carousel and slideshow tools, and the lists about them

- **Purpose:** The research behind this repo's scope, fields, sections, name, description and topics.
- **Read on:** 2026-11-17, from each tool's own website, the GitHub API and web search.
- **Raw notes:** the research files of 2026-11-17 are summarized here; the per-tool facts and source URLs live in `data/tools.json`.

## What exists

The tools fall into four groups.
The README uses the first three as its platform sections and puts the fourth under "All-round".

| Group | Typical output | Examples |
| --- | --- | --- |
| LinkedIn carousel makers | Text-led slides as a PDF document, often inside a LinkedIn writing and scheduling suite | PostNitro, Taplio, Supergrow, Contentdrips, aiCarousels, ContentIn, Postiv, WaveGen, Typegrow |
| Instagram carousel makers | Square or 4:5 image sets from templates or a prompt | Predis.ai, VistaCreate, CarouselMaker.co |
| TikTok slideshow makers | 9:16 photo posts, often for faceless accounts or app marketing, usually with auto-posting | ReelFarm, Genviral, SendShort, SlideStorm, ReelMoney, Faceless, CineRads, Wavegrain |
| All-round design and social suites | Carousels as one format among many | Canva, Adobe Express, Visme, Gamma, Simplified, Ocoya, Blotato, Viraloop |

Seen on 2026-11-17:

- MCP servers spread fast in this niche: 19 of the 39 tools show one on their own site, including Canva, Gamma, PostNitro, Contentdrips, Genviral, ReelFarm and Taplio.
  Several MCP servers only schedule or fetch drafts and do not make slides (SendShort, ContentIn's free tier, ReelFarm's MCP does not post).
- 28 of 39 tools post or schedule by themselves, but what that means differs: some publish TikTok photo posts directly, some send a draft to the TikTok inbox.
- Free plans are less common among TikTok slideshow tools; most of them offer a few free generations or a trial.
- The big design suites (Canva, Adobe Express) have no dedicated AI carousel generator; a carousel is a multi-page design.
- Canva, Gamma, Piktochart and VistaCreate blocked automated reading of their marketing pages, so some of their fields are marked claimed.

## Lists that already exist

| List | Kind | Tools | What it lacks |
| --- | --- | --- | --- |
| devanasolver/awesome-social-media-tools | GitHub | about 51 | Open-source schedulers and SDKs; the word carousel does not appear |
| shixinzhang/awesome-tiktok-tools | GitHub | about 101 | Editing, captions and analytics; no slideshow or photo-mode section |
| brandonhimpfen/awesome-linkedin | GitHub | about 31 | APIs and recruiting tools; no carousels |
| Postiv.ai, "14 best LinkedIn carousel makers" | Vendor article | 14 | LinkedIn only; ranks itself first |
| Decktopus, "Best AI carousel maker" | Vendor article | 11 | Ranks itself first; TikTok for two tools only; no export column |
| Oakgen, "AI carousel generator comparison 2026" | Vendor article | 7 | Closest to fair (no ranking, own tool last, dated); only 7 paid tools |
| CineRads, "Best TikTok slideshow makers" | Vendor article | 8 | Best TikTok coverage; lists itself; no table |
| WaveGen, Krumzi, Wireflow, Supergrow, ContentIn, Simplified, TheGuideX, a DEV post | Vendor articles | 5 to 10 each | All rank the publisher's tool first; Simplified's page is dated 2023 with 2026 in the title |

No GitHub list covers social media carousels; searching "awesome carousel" returns only UI carousel components.
Ten of the twelve articles we read rank the publisher's own tool first.
None lists open-source tools, few cover TikTok photo posts, and none has columns for export formats, own photos or watermarks.

## The gap this list fills

- One table format for LinkedIn, Instagram and TikTok together, so a reader can compare across platforms.
- Fields that searchers ask about and articles skip: export formats, whether it uses your own photos, whether it posts for you, API and MCP, free plan.
- A read date per tool and a "claimed" marker for anything not seen on the tool's own site.
- A section for open-source apps and the libraries people use to render slides from code.
- A neutral order (A to Z) from a maintainer who says openly that it makes one of the tools.

## What searchers want to know

From the FAQ sections of the articles above, vendor guides and two Show HN threads (Reddit could not be read by our tools):

1. Which tools can publish to TikTok for me, as a real photo post and not a draft?
2. Is there one tool for LinkedIn, Instagram and TikTok?
3. Does LinkedIn need a PDF, and what size should slides be?
4. Is there a free carousel maker, and does it add a watermark?
5. Can I turn a blog post, a URL or a video into a carousel?
6. Does the AI write the text too, or only the design?
7. Can I use my own photos instead of AI images?
8. Can ChatGPT or Claude make a carousel (MCP)?
9. Can I schedule carousels from the same tool?
10. Can I trust "best carousel maker" lists, since vendors write them?

The README answers 1 to 9 with columns or the "How to pick" guide, and 10 with the FAQ entry on who maintains the list.

## What we left out, and why

| Left out | Why |
| --- | --- |
| Buffer, Later, Hootsuite, Publer, Postiz | Schedulers that post carousels but do not make them (Publer's carousel maker is the PostNitro integration) |
| Metricool | Its carousels come from a Claude Code agent over its MCP server, not a built-in maker; the platforms and file formats are not stated |
| Microsoft Designer, SlideSpeak, Designs.ai, Kittl | No carousel feature found on their own sites |
| Creatopy | Now redirects to an ad platform with no carousels |
| EasyGen, Kleo, Postwise, Tweet Hunter, Jasper, Copy.ai | Text posts only, or no carousel feature seen; EasyGen takes no new sign-ups |
| Brandled, Ligo, carouselmaker.io, BigMotion | The site did not resolve, blocked reading or showed no slideshow feature |
| FranciscoMoretti/carousel-generator | Well known, but no push since 2024-09, outside our 18-month rule |
| social-media-skills/tiktok-slideshow-skill | Too new to judge (three commits, one star) |
| Three GitHub repos with no license | A project without a license cannot be reused safely |
| Agent skill files for carousels | Prompts for coding agents, not tools |

## awesome-lint and GitHub

The same rules apply as in list 1 (`awesome-launch-directories/research/ANALYSIS.md`):

- One URL once per README, so each tool sits in exactly one platform table, and the filter tables (posting, API and MCP) name tools without links.
  The overlapping full views live in `lists/`.
- The footer names Wavegrain without a link, because the Wavegrain row already links wavegrain.com.
- Pipes in tables are aligned by the build.
- `awesome-github` passes only after the repo is on GitHub with a description, topics and the license.

## Decisions for this repo

| Decision | Choice | Why |
| --- | --- | --- |
| Repo name | `awesome-ai-carousel-tools` | "AI carousel" is the phrase in most article titles; `awesome-` prefix for the awesome rules |
| Description | Names AI carousel makers, LinkedIn carousels, Instagram carousels and TikTok slideshows, plus the fields | GitHub repo search matches name, description and topics only |
| Order | A to Z in every table | No tool gets a top spot, Wavegrain included |
| Prices | None | They change often and differ by country; the owner asked for none |
| Free plan | Yes or No only | Trials and one-time credits count as No |
| Format | Tables built from `data/tools.json` | Same columns for every tool; the build keeps them consistent |
| License | CC0 | Required for sindresorhus/awesome later |
