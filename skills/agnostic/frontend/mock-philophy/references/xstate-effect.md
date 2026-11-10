# XState and Effect mapping

Read this reference when the consuming frontend uses XState and Effect. The general contract,
simulation and ownership rules remain in the skill entrypoint. These APIs are stack-specific;
projects using other state-machine libraries implement the same boundaries with their own tools.

## Reference implementation

The [next-effect-app actor rule](https://github.com/collective-intelligence-solutions/next-effect-app/blob/main/.agents/rules/web/effect-actors.md)
and [intake machine](https://github.com/collective-intelligence-solutions/next-effect-app/blob/main/packages/features/intake/src/headless/intake-machine.ts)
illustrate the pattern. Read the consuming project's installed SDK API and current local rules
before copying code. The reference repository is private; when unavailable, use accessible project
sources and state that the upstream version was not verified.

Transfer the frontend mechanics below. The template's live default, backend API, CI workflows,
package topology and `headless/simulated-*.ts` naming are not requirements of this skill. For source
placement, follow `frontend-domain-structure`: simulations belong in their owner's `simulated/`.

## Actors and runtime

- Declare asynchronous actors in `setup({ actors })`. With the CI React Effect bridge already
  installed, use its `fromEffect(program)` adapter and pass the runtime through actor input.
  React views obtain that runtime through `useEffectRuntime()` under `EffectRuntimeProvider`.
  With a different bridge, follow its existing equivalent; do not install this SDK for mocking alone.
- Bind the simulated implementation selected by Composition with `machine.provide({ actors })`.
  Keep that binding out of domain views. Reuse actor factories when they retain the same cache and
  error behavior across source implementations. Every actor reachable in mock mode must be simulated
  or an explicitly retained real dependency; do not inherit a live default accidentally.
- When the installed SDK provides `effectTask(run)`, reuse it for a single action's
  `RUN` / `running` / `done` / `failed` lifecycle. Use a dedicated machine for a multi-step flow or
  an independent lifecycle. Do not introduce an SDK dependency solely to obtain this helper.

## Data and feedback

With the CI bridge, actors interact with cached data through its `QueryCache` service. Use the
existing frontend cache for records and reads; machine context holds flow state. Writes run through
machine actors rather than a parallel TanStack `useMutation` lifecycle. A simulated write changes
the backing source and then updates or invalidates the relevant queries, so a refetch retains it.

Branch on typed failures in `onError`, using `Schema.is(ErrorSchema)` for Effect Schema errors.
Keep UI feedback in typed actions supplied by the view through `machine.provide({ actions })`.
Do not run Effect programs directly from rendering or bypass the machine from a click handler.

## Controlled scenarios

When the project already offers `simulate(pace, effect)`, use it for controllable network pacing.
Otherwise inject an equivalent scheduler or effect implementation in `simulated/`; keep timing
out of views. Use deterministic actor outcomes and a test clock or instant pacing in tests.

For the CI bridge, use its `makeTestQueryCache` layer on the test runtime rather than a hand-written
`QueryCache.of` double. Drive machine events and assert cache entries or recorded calls as well as
the resulting state. Use the project's existing test runtime for other Effect bridges.
