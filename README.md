# Devpunks Skills

Public Devpunks skill library.

This repo is the public Devpunks skills database and the baseline skill source used by the Harness Intelligence CLI.

The CLI vendors this repository as reusable skill content. Keep shareable skill behavior here first, then let the CLI consume it through its normal skills sync/update flow.

## CLI Entrypoints

The CLI skills users should manually install with the Skills CLI are `hi-cli` and `secrets-cli`:

```bash
skills add https://github.com/wearedevpunks/skills/tree/main/skills/agnostic/cli/hi-cli --skill hi-cli --global --yes
npx skills add https://github.com/wearedevpunks/skills/tree/main/skills/misc/secrets-cli --skill secrets-cli --global --yes
```

`hi-cli` is the entrypoint for `hi`/`hint` usage, setup-stage guidance, `hi update`, GitHub-backed `hi report`, explicit `hi upgrade`, and the post-command `.devpunks/` artifact flow. `secrets-cli` is the required operator skill for the `secrets` executable. Other Devpunks skills are intended to be scaffolded or vendored by the CLI rather than manually installed one by one.

## Contextual skill authoring

Invoke the [sk7lls skill](skills/misc/sk7lls/SKILL.md) with `$sk7lls add <request>` to propose a new skill from the conversation and current context, or from a path supplied in the request. This is an agent invocation, not a shell command. It uses `readonly` and `writing-for-agents` internally; both skills must be available to the agent.

The proposal stays in chat. Ask for a dry run to inspect its behavior without changing state. After approval of the content and destinations, the workflow saves the skill in the local agent skill directory and the `sk7lls` library, commits the approved files, and pushes directly to the agreed branch. Existing symlink installations can share the library copy.

## Structure

- `skills/agnostic/*` holds cross-stack packs like planning, research, frontend, docs, quality, and subagents
- `skills/phases/*` holds lifecycle phase packs like requirements, delivery, debugging, review, docs ingest, and debt resolution
- `skills/frameworks/*` holds stack-specific packs like Better Auth, Effect, Elysia, Next.js, tRPC, and Turborepo
- `skills/misc/*` holds focused operational workflows that do not belong to a stack or lifecycle phase
- `skills/work/*` holds work-environment workflows, including [local Collective Intelligence instances with selected external apps](skills/work/ci-local-test-environment/SKILL.md)
- each skill still owns its own `SKILL.md` plus any local references, templates, scripts, or helper assets
- some pack semantics overlap; physical grouping follows the main domain owner, so shared packs can reuse the same skill family

## Consumers

- CLI and tooling integrations that want Devpunks skills as reusable content
- future consumers that vendor or read this library directly
