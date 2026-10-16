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

Use the framework's own shapes for composition and access:

- Shared structure belongs in layouts and route groups. Access checks are plain server
  calls at the top of each protected page or its data loader, returning the identity the
  page needs. Repeat them on every page: frameworks with partial rendering (for example the
  Next.js App Router) keep layouts mounted across client navigation and do not re-run them,
  so a layout-only check misses navigations.
- Signal outcomes with the framework's interrupts and convention files instead of returning
  substitute UI from a helper. The framework then stops the page, picks the fallback and
  sets the status. For example:
  - Next.js: `redirect()` for sign-in or another destination, `forbidden()` or
    `unauthorized()` rendered by `forbidden.tsx` or `unauthorized.tsx`, and `notFound()`.
  - Remix / React Router: the route `loader` throws `redirect()` or a 403 `Response`,
    rendered by the route's error boundary.
  - SvelteKit: the `load` function calls `redirect()` or `error(403)`, rendered by
    `+error.svelte`.
- Avoid wrappers that take the page as a render callback, such as
  `withAccess(key, (user) => <Page />)`. They invert the page's shape, mix the access
  decision with view selection and bypass the framework's statuses. Prefer
  `const user = await requireAccess(key)` followed by the page's own JSX.

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
