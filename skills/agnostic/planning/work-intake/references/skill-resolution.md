# Resolve the named skills

Resolve `requirements-phase` and `functional-finder` independently, only when
their route is relevant. Read the real `SKILL.md`, not just a catalog summary.
Prefer exact folder/frontmatter names; do not silently substitute
`requirements-grill`, `grill-with-docs`, `wayfinder`, or another Finder wrapper.

## Precedence

1. **Current project:** use the session's skill catalog, applicable project
   guidance, and project skill roots such as `.agents/skills`, `.codex/skills`,
   `.claude/skills`, or a documented source `skills/` directory. Respect the
   nearest applicable project override.
2. **Machine:** use the configured personal skill roots, including
   `$CODEX_HOME/skills` (default `~/.codex/skills`), `~/.agents/skills`, and
   `~/.claude/skills`, then an active installed distribution that provides the
   exact named skill. Follow symlinks to its actual source. For a DevPunks CLI
   installation, inspect the active package location and its
   `dist/skills/phases/<name>/SKILL.md`. `pnpm root -g` or `npm root -g` can help
   locate the package; verify which installation is active rather than picking
   the highest version directory by name.
3. **Repository fallback:** if no applicable local copy exists, read the exact
   named skill from `https://github.com/wearedevpunks/skills`.

Use `rg --files --hidden` over relevant roots for discovery; include symlink
targets where necessary. Widen the search only if ordinary roots miss a known
installation. Archived baselines, backups, replaced-skill directories, and
unrelated projects are not active installations. A source checkout expressly
designated by the user or project guidance can be authoritative.

For equally applicable conflicting copies, report the paths and ask which to
use before invoking the affected phase. An explicit user source choice wins.
Do not overwrite, update, or install child skills as part of routing.

## Keep the selected contract intact

Resolve relative references from the selected skill's real directory. Resolve
named dependencies from that project's catalog or the same distribution before
considering another source. Read only dependencies needed for the current
step. Do not overlay the latest remote workflow onto an older local version.

If a required reference is missing, check the matching distribution/version.
If it cannot be recovered, report the exact missing dependency and retain the
handoff. Do not claim that a phase ran successfully or invent its mechanics.

For a remote fallback, resolve `main` to a commit SHA once and use that SHA for
the skill and all its repository-relative references. A temporary checkout can
preserve the layout without installing the repository or executing its scripts.
If a path has moved, search the tree at that commit for the exact skill name.
Record the source path/URL and version or commit used in the handoff.

## Inspected references

Creation-time machine reference: the active pnpm global `@punks/cli` package,
version `4.0.4`, provides both named skills under `dist/skills/phases/`.
Its Requirements Phase composes `requirements-grill -> create-spec ->
write-backlog`. Its Finder engine's `references/root-routing.md` requires
explicit human invocation of `functional-finder` before entry.

Repository reference inspected at commit
`189cb1147b9c7588b0f73f41f029d49f95f3bce0`:

- [Requirements Phase](https://github.com/wearedevpunks/skills/blob/189cb1147b9c7588b0f73f41f029d49f95f3bce0/skills/phases/requirements-phase/SKILL.md)
- [Functional Finder](https://github.com/wearedevpunks/skills/blob/189cb1147b9c7588b0f73f41f029d49f95f3bce0/skills/phases/functional-finder/SKILL.md)
- [Finder root routing](https://github.com/wearedevpunks/skills/blob/189cb1147b9c7588b0f73f41f029d49f95f3bce0/skills/phases/finder-phase/references/root-routing.md)

That repository version adds `create-architecture` before `create-spec` in
Requirements Phase. This difference is why runtime local precedence matters.
These observations explain the router's design; reread the selected contract
at use time rather than treating these snapshots as permanent instructions.
