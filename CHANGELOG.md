# Changelog

All notable changes to this project are documented in this file.

## v0.1.4 - July 24, 2026

**Snapshot workflow resilience**

- Add `timeout-minutes: 10` to the `snapshot` job in `.github/workflows/snapshot.yml`
  so the hourly run fails fast if a GitHub-hosted runner cannot be acquired, instead
  of hanging for ~15 minutes.

## v0.1.3 - July 14, 2026

**Demo video**

- Add a ~2 minute end-user walkthrough video (`demo/hss-ed-demo.mp4`) and link it
  from the README.

## v0.1.2 - July 14, 2026

**Hackathon-ready README**

- Add explicit Problem statement, Target users, and What we built sections.
- Rename Architecture to Solution architecture and embed the diagram
  (`docs/architecture.svg`).
- Add the live demo link.

## v0.1.1 - July 14, 2026

**Clarify the HSS acronym**

- Define HSS (Health Shared Services) on first use in the README, the architecture doc
  heading, and the app privacy notice intro (EN and FR).

## v0.1.0 - July 14, 2026

**Architecture diagram moves to D2; contributor workflow docs**

- Replace the Mermaid architecture diagram with a D2 source (`docs/architecture.d2`)
  rendered to a committed `docs/architecture.svg` and embedded in `docs/architecture.md`.
- Add the `docs:diagram` npm script to regenerate the SVG.
- Add contributor workflow and repo-memory docs: the `AGENTS.md` release workflow,
  this `CHANGELOG.md`, and `memories/` (README plus `repo/workflow.md`).

## v0.0.0 - July 14, 2026

**Project baseline**

- Initial changelog created to support the release workflow documented in `AGENTS.md`.
