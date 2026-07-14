# Workflow

## Build

- `npm run build` runs `tsc -b && vite build`. It must pass before merging.

## Branching and releases

- Default branch: `main`. Never commit or push directly to `main`.
- Work on `feature/xyz` branches, open a PR into `main`, then merge.
- Every merged change updates `CHANGELOG.md` and gets a matching GitHub release. See the "Release Workflow" section in `AGENTS.md`.

## Diagrams (D2)

- The architecture diagram lives in `docs/architecture.d2` (D2 source) and renders to a
  committed `docs/architecture.svg`, which `docs/architecture.md` embeds. GitHub does not
  render D2 natively, so the SVG must be committed.
- Edit the `.d2`, never the `.svg` by hand. Regenerate with `npm run docs:diagram`
  (`d2 --layout elk --theme 0 docs/architecture.d2 docs/architecture.svg`).
- Install the D2 CLI: Windows `winget install Terrastruct.D2`; macOS `brew install d2`;
  Linux/macOS `curl -fsSL https://d2lang.com/install.sh | sh -`.
- PNG export needs Playwright and may be blocked in this environment; stick to SVG.

## Gotchas

- (Add project-specific gotchas here as they are discovered.)
