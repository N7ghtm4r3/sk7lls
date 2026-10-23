# Collective Intelligence and external applications

Use for every invocation: CI alone or CI combined with the selected external
apps and integrations. Here CI means Collective Intelligence, not a continuous
integration pipeline.

## Resolve the existing instance

Identify the CI checkout and actual backend database/volume from private state,
current configuration and runtime. The app's CI issuer, organization and
registration must refer to this instance. Distinguish a persistent developer
stack from a disposable proof checkout: the latter may already be removed.
A local organization name alone does not establish a match.

Retain the database and its matching encryption key when resuming. Verify the
account and native app role before suggesting another identity or instance.
Recover the account identifier from established setup records; similar-looking
email addresses are different accounts.

## Discover supported startup

Read the selected revision's startup scripts, environment templates and local
runbook. Reuse its official entrypoint, dependency initialization, migrations,
bootstrap reconciliation and built-in activation order. Determine whether the
test needs API, dashboard, workers, storage, or other services. Use a
supported scoped entrypoint; a missing one is a reported setup gap, not
a reason to edit CI source.

Revisions differ in package manager, backend roles, ports and bootstrap needs.
One `ci-app` setup used `bun run dev --no-open`; treat that as a discovery hint,
not a command assumed valid for every checkout. Omit optional development tools
where the supported launcher allows it.

For a configuration decoding failure, inspect the actual failing setting. Old
private files may contain Python-style `True` where the decoder expects `true`.
Preserve the boolean value when normalizing it. Verify the task runner forwards
overrides to the child process; consult its installed documentation before
changing passthrough. A blanket loose environment mode is not a generic fix.

## Match HTTPS and identity

| Side | Values to match |
| --- | --- |
| CI API | Public issuer/API origin, discovery and JWKS endpoints |
| CI dashboard | Public dashboard origin used by authorization redirects |
| External app | Public HTTPS origin, callback URL, audience and registration |
| Browser and app server | Local CA trust and session configuration |
| Account | Organization membership and required native app role |

Configure the dashboard's public origin as well as the API's. Serving a
dashboard over HTTPS while CI redirects to its direct HTTP port can select a
different browser session and break the intended round trip.

A Node external app using Portless may require `NODE_EXTRA_CA_CERTS` at process
startup. Confirm the consuming process received the setting or restart the
owned app with the correct environment. Some servers rewrite their process
title and hide environment details from process listings; missing output from
that listing alone is inconclusive. Verify an actual HTTPS operation and the
authentication callback. Use the documented trust mechanism rather than
disabling TLS validation or changing global trust as a shortcut.

Use the installed CLI's supported enrollment/environment export commands for
new app registration. Preserve a resumed registration and let the CLI maintain
enrollment keys. Copying a staging client ID does not register an app locally.

Enrollment and admission are separate. A tenant administrator can manage CI
while lacking a role in an external app. Use supported product flows for needed
assignments within the authorized scope. A portal UI mock role does not grant
native CI admission. Consult the API engineering skill available in the session
when administering or testing a nontrivial API flow.

## Verify and retain

Check CI application readiness, then navigate from the external app through
CI sign-in and consent back to the configured callback. Verify the signed-in
identity and target app page. A dashboard login, HTTP 200, or authorization
redirect alone leaves external-app access unverified.

Record actual origins and private configuration references in environment
state. Keep actual credentials, cookies and OAuth artifacts out of the skill and
state index; the documented local fixture default is the only password literal. Persistent instances retain database, enrollment and private keys.
Disposable cleanup restores any borrowed app configuration and removes only
owned resources after the user's testing ends.

When an isolated instance temporarily borrows an external app checkout, preserve
its previous private configuration before enrollment and record the restoration
path. Allocate separate proxy state/routes where names would collide; reusing a
shared proxy does not authorize replacing another environment's aliases.
