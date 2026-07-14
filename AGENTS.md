# AGENTS.md

This project ships Rayfin agent context.
Load `.agents/skills/rayfin/SKILL.md` and the `rayfin` MCP server in `.mcp.json` before writing Rayfin code.

Rayfin docs are version-locked to the packages installed in this project.
Prefer the MCP tools `search_docs`, `get_doc`, `list_docs`, and `discover_packages` for examples, API details, and troubleshooting.
If MCP is unavailable, run `rayfin docs ...` from the project root so the CLI reads this project's `node_modules`.
If `rayfin` is not on `PATH`, use `npx -y @microsoft/rayfin-cli docs ...` from the project root.

Use `discover_packages` or `rayfin docs discover <topic>` when installed docs do not cover the task.

<!-- BEGIN:repo-memory -->
## Repo memory - read first

Before any non-trivial task, read `memories/repo/` (index in `memories/README.md`).
<!-- END:repo-memory -->

<!-- BEGIN:release-workflow -->
## Release Workflow

**NEVER commit or push directly to `main`.** Always create a feature branch (`git checkout -b feature/xyz`), push it, then merge to main. Run `npm run build` and verify it passes before merging.

The full workflow for every change:

1. **Feature branch** - `git checkout -b feature/xyz` from `main`.
2. **All commits on the branch** - Code changes AND `CHANGELOG.md` entry go in the same branch. Never commit anything directly to `main`.
3. **Push branch** - `git push -u origin feature/xyz`.
4. **Create PR** - `gh pr create --base main --title "..." --body "..."`.
5. **Merge PR** - `gh pr merge --merge`.
6. **Pull main** - `git checkout main && git pull origin main`.
7. **GitHub Release** - `gh release create vX.Y.Z --title "vX.Y.Z - Short Title" --notes "..."`.

Every feature or meaningful change merged to `main` MUST include:

1. **CHANGELOG.md** - Add a new version entry at the top of `CHANGELOG.md` with the date and a summary of changes. Follow the existing format: `## vX.Y.Z - Month DD, YYYY` with a bold subtitle and bullet points.
2. **GitHub Release** - After merging, create a GitHub release using `gh release create vX.Y.Z --title "vX.Y.Z - Short Title" --notes "..."` with the same notes from the changelog entry. Tag the release on `main`.
3. **Version bumps** - Increment minor version (0.X.0) for new features, patch (0.0.X) for bug fixes only.
4. **README.md** - Update if the change adds/removes pages, API routes, features, project structure, environment variables, or deployment behavior. Keep the Features, Project Structure, Data Model, and Deployment Workflow sections current.
5. **Repo memory** - Update `memories/repo/workflow.md` if the change affects build commands, deployment flow, migration strategy, or common gotchas.

Do NOT put changelog content in README.md - it links to CHANGELOG.md instead.
<!-- END:release-workflow -->
