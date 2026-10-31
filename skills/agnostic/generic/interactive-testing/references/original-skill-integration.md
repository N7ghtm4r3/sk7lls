# Original skill integration

Resolve and read the original entrypoints below. This note owns source selection
and the Interactive Testing caller binding; the selected skills own their
procedures and supporting files.

## Read only the selected branch

| Skill | Read when | Original source in this distribution |
| --- | --- | --- |
| `verify-behavior` | Preparing scenarios, selecting coverage, or evaluating verify/reproduce evidence | [verify-behavior](../../verify-behavior/SKILL.md) |
| `create-verification-skill` | Preparing proposed or separately authorized maintenance for a selected uncovered surface | [create-verification-skill](../../create-verification-skill/SKILL.md) |
| `update-verification-skill` | Preparing proposed or separately authorized maintenance for selected missing/stale behavior coverage | [update-verification-skill](../../update-verification-skill/SKILL.md) |
| `handoff` | Preparing, refreshing, or resuming a continuation | [handoff](../../handoff/SKILL.md) |

An exact user/project source selection takes precedence over these distribution
paths. Otherwise use these originals. Follow symlinks, inspect frontmatter, and
resolve required relative files and named dependencies from that selected
distribution. Read dependencies only when their own branch fires. Record the
actual source path, Git revision and relevant uncommitted changes, or content
hash where revision information is unavailable, in the session records.

If the distribution has moved, resolve its original source layout or its active
installation rather than selecting a same-name copy blindly. When remote
recovery is necessary, resolve the chosen repository revision to one commit and
use it for the entrypoint and required files together. Verify a host invocation
selects that exact source; otherwise use permitted file-based reading. Missing
files/contracts block their affected phase. Conflicting equally applicable
sources require a user choice. Source reading authorizes no installation or
workflow execution.

The selected verification source must supply project-owned coverage selection,
its Reference contract, and identity-bound falsifiable proof. An older or
different same-name skill lacking that interface is incompatible for this
caller. Reading a maintenance contract for a proposal remains read-only;
authoring and live proof wait for their separate authorization.

## Caller binding

Delivery context is **optional for Interactive Testing**. Keep an existing
delivery branch, PR, and artifact identity when applicable; their absence does
not block separately authorized interactive verification or coverage maintenance.
Use the selected project/worktree and record absent delivery identities as not
applicable. Creating a branch, PR, or delivery workflow requires separate scope.

This caller rule replaces delivery-specific branch/PR prerequisites and returns
acceptance control to Interactive Testing rather than `implement-spec`. It
changes no upstream source. Supply the original selected scenario and its
authorized bounds; follow every other applicable requirement of the selected
skill. Report an incompatible version explicitly rather than copying or
silently replacing its procedure.

Apply dependency actions through Interactive Testing's one-step confirmation
loop, existing authorization, remaining attempts, optional monitoring boundary,
and external records. This also covers maintenance smoke actions, reset/retry,
and re-proof. Maintenance permission and readiness remain separate from the
user's workflow conclusion. Reuse proof only when the original skill's evidence
requirements and the caller's provenance and confirmations still apply.

The Project Verifier path belongs to the tested project, independently of host
discovery roots. For projects without generated DTOs, use actual public schemas,
interfaces or observable outputs and their deciding source predicates as the
manifest source; unsupported expectations remain speculative. User-driven
interaction is permitted when the declared evidence is accessible, with user
reports kept separate from agent observation. A public consumer harness may
exercise API/service/library behavior; it does not replace required UI proof.

Use the original `handoff` contract and the local [session records](session-records.md)
for this non-delivery session. Delivery-specific handoff obligations apply only
when the receiving task itself is authorized delivery work. A discovered product
failure returns to this caller; debugging or repair needs the user's request.
