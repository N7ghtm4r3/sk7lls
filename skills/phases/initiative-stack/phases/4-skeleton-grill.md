# Phase 4: Skeleton grill

Goal: close the decisions the walking skeleton needs, and route every other
question to the PR that owns it. Run `requirements-grill` with the skeleton
as its topic. The Brief and the inventory are its input.

## Scope rule

A question belongs to the skeleton grill only when the scaffold needs the
answer: app placement, conventions versus the reference app, authentication
and roles, navigation catalog and routes, server platform layer, spec folder
location, home before its slice arrives.

Every other question moves to the grill of the first slice that needs it.
That includes the data model, entity states, mock data, glossary terms and
feature behavior. Later slices inherit the answer from that slice. Record the
move in the grill log with the target PR number. An answer the user already
gave on a moved question stays accepted and becomes input to the target
grill.

When the scope rule and an earlier grill question conflict, record a new
decision that supersedes the earlier one. Leave the old entry in place.

## Debt

Keep a `Technical debt` section in the grill status. It holds deferred
extractions, migrations and broken tooling found in grounding. Carry it into
the skeleton spec in Phase 5.

## Turn

Follow the round rhythm of `requirements-grill`. At the end, show the
summary and ask for confirmation and closure in one sentence the user can
copy. Commit and push the grill files only after closure.

Done when: the close guard of `requirements-grill` passes, the user confirms
and closes, and every moved question names its target PR.
