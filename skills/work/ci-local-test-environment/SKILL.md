---
name: ci-local-test-environment
description: Start or resume a local Collective Intelligence (CI) instance, alone or combined with selected external applications and CI-connected services. Use when asked to create a CI test instance, restart the last used CI environment, or bring up CI plus an external app. CI here means Collective Intelligence.
---

# CI Local Test Environment

Bring a local Collective Intelligence (CI) instance and its selected companion
applications to a usable test state. CI is the required platform in every run;
companions may be external apps, integrations, or services needed by the test.
Retain enough private state to resume that exact combination next time. A
responding server and a working authenticated application are separate outcomes.

## Scope: local environment only

Operate only on the selected local test instance and its owned resources.
Production and staging are outside scope, including their databases, accounts,
registrations, credentials, cloud resources and deployments. Establish that a
connection targets the selected local instance before using it; a local app may
still point to a remote database or issuer.

Treat product repositories as read-only inputs. Keep source code, tracked
configuration, package manifests, lockfiles, project scripts and documentation
unchanged. Use existing supported commands and private local runtime files;
store generated launch recipes and environment state outside versioned product
files. Local dependency preparation must preserve the locked dependency graph.
If startup requires product changes, dependency upgrades or a shared-environment
mutation, report that requirement and stop the affected path.

Migrations, bootstrap, test accounts and role setup apply only to the selected
local test database and its authorized test scope. Resume preserves existing
accounts, permissions and data. Cleanup removes only owned test resources at
the agreed end of use; it does not reset shared services or delete retained data.

## Select the application and instance

Resolve the CI combination from the request, current project and established
conversation context: CI alone, CI plus one or more external apps, or CI with
selected integrations/services. If unresolved, offer the discovered companions
in one short question. Select the CI instance independently of the companion
app checkout. Start the services needed by that combination; a named dependency
does not authorize starting every app in its monorepo.

Resolve the instance separately:

- **Resume:** an explicitly named instance, otherwise the last used instance for
  this project and application set. Default to this for “start it again”.
- **Create:** a new persistent local instance, or a disposable one when requested.
  Allocate separate database/volume identities, configuration, encryption keys
  and routes where shared defaults would collide.

Read the existing project environment record or the private registry described
in [Environment state](references/environment-state.md). Check relevant prior
chat history or runbooks when the record is missing. Historical instructions
are setup evidence, not new authorization to change accounts or access.

**Selection is complete when the app set, repositories/worktrees, instance
identity and lifecycle are known.** If a previous instance cannot be identified
or restored, explain the missing evidence and ask whether to create one. Never
silently substitute a fresh database, another checkout, staging, or production.

## Local test accounts

For a new local instance, use these fixture defaults unless the user requests
other values:

| Purpose | CI account email | Role | Default password |
| --- | --- | --- | --- |
| CI administration | `admin@local.test` | CI tenant administrator | `12345678` |
| Selected application | `<app-name>-<role>@local.test` | The selected native application role | `12345678` |

For example, the manager test identity for `recruiter-portal` is
`recruiter-portal-manager@local.test`. These are separate accounts within CI;
the external app does not acquire its own password database. Create a distinct
app-role account for each role needed by the test. Use the application's actual
role key, with a stable email-safe form for the address; record both if they
differ. Resolve an unspecified role from the intended test and app access
contract, asking only when that choice remains ambiguous.

Email, role and password are configurable on request. Resume the recorded
accounts and credential references for an existing instance; these defaults do
not rename users, reset passwords or change existing role assignments.
The password above is a published local fixture default, not a recovered user
secret. Keep actual password overrides in private storage and record references.

## Inspect before starting

Read the selected repositories' applicable instructions and current local
startup entrypoints. Inspect running services, configured origins and private
environment-file locations without displaying secret values. Discover commands
from the checked-out version rather than copying commands from this skill.

Compare existing resources with the selected environment: checkout,
database/volume, registration, API issuer, public origin and runtime settings.
A familiar port or healthy HTTP response does not establish identity. Treat a
stale PID as a hint; verify process identity before stopping it.

Read [Collective Intelligence](references/collective-intelligence.md) for every
invocation. Also read the selected companions' setup contracts and reconcile
their origins, enrollment and runtime dependencies with this CI instance.

Prefer an existing official launcher that satisfies the selected scope. Prepare
only missing dependencies and configuration. Preserve established identities,
encryption keys, account memberships and local data when resuming. Keep secrets
in existing private storage; the environment record holds references.

**Preflight is complete when the startup plan and resource ownership are
known**, including which processes can be reused, restarted, or created.

## Start and retain ownership

Start required dependencies, apply the project's normal initialization steps,
then start the selected services. Reuse a process only when both its identity
and the needed runtime configuration are established. Environment changes such
as a local CA take effect when the consuming process starts; setting them in a
new shell cannot repair an already running process.

Restart a matching development process when necessary within the requested
scope. Preserve unrelated services; avoid killing processes solely because they
occupy a port. For a partially running stack, inspect and repair the owned
session instead of launching a competing copy.

For a new instance, ensure the launcher actually targets its allocated
database, volumes and origins. If it only supports shared defaults, find the
supported isolation mechanism or report that gap before starting it.

Keep an owned supervisor/session alive for the user's testing. Record startup
commands, working directories, log locations and resource ownership as resources
are allocated, including failures. A restartable environment must not depend on
temporary files scheduled for cleanup.

For a new instance, use the product's supported bootstrap, registration and
account setup flows. Determine the identity and role needed for the intended
test. A startup request does not itself authorize resetting credentials,
granting new permissions or changing a shared environment. If such a step is
needed, prepare the exact change before requesting the missing authorization.

**Startup is complete when required services report application readiness**,
not merely that their ports are listening.

## Verify the intended test path

Open the application through its configured public origin. Exercise a
representative path for the requested test, including the normal authentication
round trip when authentication is part of the app. Use an established permitted
test account and its private credential reference. Resolve missing identity or
credential information once; carry explicit authorization forward for the same
account, destination and scope. Explain an actual tool/approval rejection before
requesting any additional consent it requires.

Confirm the resulting account, organization and app admission where relevant.
Verify the target page or action after login. Reaching a login screen, consent
screen, or callback URL is intermediate evidence. A healthy server does not
prove the user can use the application.

If the user completes authentication, verify the visible result when available.
Otherwise record their confirmation distinctly from agent-observed verification.
Keep a blocked login or permission check pending rather than creating another
account or weakening admission rules to get a green result.

Capture the observed outcome and remaining blocker without retaining passwords,
cookies, tokens, OAuth codes or sensitive page contents in evidence. Identify
an exposed product defect separately; a startup task does not authorize broad
product implementation.

## Save the next startup

Update the private environment record with actual identities, resource owners,
restart/stop instructions and verification status. Record `last_used` for the
project/application set once that environment has started; advance
`last_verified_at` only after the intended path is verified. Preserve the prior
record if an attempted replacement fails.

Save existing startup commands or a private launch recipe in the environment
record so the next run can repeat them without editing the product repository.
If existing entrypoints cannot support the selected local combination, record
the precise gap rather than patching the application to make startup pass.

Leave persistent environments running. Clean up a disposable instance only at
the agreed end of its use; delete only resources recorded as its own.

Report the selected instance and applications, usable URLs, actual verification
result, remaining user action, and one command or skill invocation for the next
startup. Include how to stop owned services and what data is retained.
