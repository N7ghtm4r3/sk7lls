# CI environment state

Use the project's existing private environment registry when available.
Otherwise use `~/.local/state/devpunks/ci-local-test-environments/` on Unix-like
hosts, or the user's local application-data directory on other hosts. An
explicit state-directory preference takes precedence. Keep the directory
private to the user and exclude any project-local equivalent from version
control. This state belongs to the execution host, not this skill repository.

Use an index pointing to one record per environment. Key selection by canonical
project root and sorted application set, so CI alone and CI with an external
app can retain different last-used instances. Store repository/ref information
alongside local paths when available. A record copied to another host requires
rediscovery of its paths and resources.

Example information to retain; this does not prescribe an application schema:

```json
{
  "version": 1,
  "environment_id": "talent-local",
  "project_root": "/workspace/talent",
  "applications": ["ci", "recruiter-portal"],
  "lifecycle": "persistent",
  "repositories": [
    { "application": "ci", "path": "/workspace/ci-app", "revision": "<observed-ref-or-sha>" },
    { "application": "recruiter-portal", "path": "/workspace/talent", "revision": "<observed-ref-or-sha>" }
  ],
  "configuration_refs": ["/private/local-ci/backend.env", "/private/local-ci/portal.env"],
  "identity": {
    "issuer": "https://ci-api.localhost:1355",
    "organization_id": "<observed-organization-id>",
    "application_id": "<observed-application-id>",
    "accounts": [
      { "purpose": "ci-admin", "email": "admin@local.test", "role": "tenant_admin", "credential_ref": "<private-admin-credential-reference>" },
      { "application": "recruiter-portal", "email": "recruiter-portal-manager@local.test", "role": "manager", "credential_ref": "<private-app-credential-reference>" }
    ]
  },
  "resources": [
    { "kind": "database", "name": "talent_ci", "owner": "environment", "retain": true },
    { "kind": "process", "role": "portal", "pid": 12345, "started_at": "<timestamp>", "cwd": "/workspace/talent", "owner": "session" },
    { "kind": "https-route", "name": "recruiter-portal.localhost", "owner": "shared", "retain": true }
  ],
  "startup": [
    { "cwd": "/workspace/talent", "command": "pnpm dev:portal-ci", "log_path": "/private/local-ci/startup.log" }
  ],
  "stop": { "instruction": "Stop the owned launcher; keep the database volume and shared proxy." },
  "verification": {
    "status": "awaiting-user-auth",
    "service_readiness": "ready",
    "observed_at": "<timestamp>",
    "last_verified_at": null,
    "target": "/candidates/new",
    "blocker": "User is completing CI sign-in."
  }
}
```

Keep the index's `last_used_environment_id` separately from verification status.
A started environment awaiting login is still resumable; it has not become
verified. Distinguish `agent-observed`, `user-confirmed`, and `blocked` evidence.

Record environment-variable names and private file/keychain references, not
secret-bearing connection strings or expanded shell commands. Retain base
public URLs rather than OAuth URLs carrying state/codes. Local test passwords
remain credentials even when they are simple fixture values.

Before reuse, check resource identities against the live host. PIDs can be
recycled, containers replaced, and checkouts moved to other branches. A revision
mismatch is a compatibility decision, not permission to reset a checkout.
Reconcile a different database, issuer or registration instead of silently
replacing the record.

Write records atomically with user-only access. Preserve unrelated entries and
previous successful configuration. Record owned partial allocations on failure
so cleanup is bounded. Retire an alias only after its owned resources have been
cleaned up or explicitly retained and recorded.
