# Web authentication boundaries

Use the product's accepted authentication contract and the web framework's trusted
execution boundaries when applying the blueprint.

## Route access

Separate public and protected routes when both exist. Route groups such as `(public)`
and `(protected)` are organizational conventions; enforce access in the trusted server
or API boundary. Create public pages only when the product calls for them.

Keep these outcomes distinct:

- No authenticated session: start the product's authentication flow.
- Authenticated session without permission: present the appropriate denial or permitted
  destination according to product policy.

Routes apply feature-owned permission and visibility rules. A landing route may select the
first permitted destination using those rules. Protected data reads and mutations require
their own trusted checks even when navigation and visible controls use the same policy.

## Authentication flow

When authentication is delegated and automatic, initiate the configured identity-provider
flow instead of introducing a local login page or form. Preserve the requested destination
within the application's allowed navigation contract. Account for callback completion,
cancelled or failed authentication, and expired sessions so failure cannot become a redirect
loop.

When the product specifies a local login experience or another authentication model,
preserve that choice and give its actual screens their own page templates.
