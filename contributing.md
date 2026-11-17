# Contributing

Thanks for helping keep this list fair and current.
The most useful change is a correction: a new export format, a new MCP server, a free plan that ended, a tool that shut down.

## Rules for an entry

- The tool makes carousels or slideshows for social media itself.
  Plain schedulers that only post them, and tools that only write text posts, do not belong here.
- Every fact comes from the tool's own website, with the date you read it.
  Anything you saw only somewhere else, such as a review site or a launch page, goes in `claimed` with its source in `claimedFrom`.
- No prices.
  The `freePlan` field is only `yes` (a free plan that lasts) or `no` (paid plans or a trial only).
- The note is one honest sentence: what the tool is good at, who it fits, and a limit if there is one.
  No ratings, no hype, no affiliate or tracking links.
- No paid placement.
  We do not take money or a link back for an entry, and the tables stay in A to Z order.
- Adding your own tool is fine; say so in the pull request, and describe it as plainly as the rest.

## Open-source projects

- The project is on GitHub, has a license, is not archived and had a push in the last 18 months.
- Copy the stars and the last push date from the GitHub API on the day you add it.

## How to change the list

1. Edit [data/tools.json](data/tools.json).
   Never edit `README.md`, `lists/` or `downloads/` by hand; they are generated.
2. Run `npm run build` (Node 20 or newer, no install needed).
   It checks the data and fails with a clear message if a value is wrong.
3. Run `npm run lint` to check the README with awesome-lint.
4. Open a pull request with the generated files included, and link the pages you read.

## Changing the prose

The README text lives in [templates/README.md](templates/README.md).
Keep one sentence per line, plain words and no em dashes.
