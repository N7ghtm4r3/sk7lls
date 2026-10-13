## 5. Generate Performance Benchmarks

Enter this generation step only after explicit benchmark implementation authorization. Otherwise stop after read-only benchmark analysis and leave all benchmark files unchanged.

After authorization, create actual benchmark source files separately from coverage tests. Use the repository's existing benchmark framework and directory layout. If the repository lacks a benchmark harness, add the smallest repository-native benchmark-scoped dependency and configuration that supports the requested measurements without affecting production artifacts.

Implement the complete performance harness:

- declare required benchmark-scoped dependencies;
- register benchmark source sets, suites, targets, compilations, and tasks;
- configure warmup, measurement, reporting, and dead-code-elimination support through the native harness;
- add benchmark-only fixtures and parameter sources;
- expose the exact repository-native commands that execute the benchmarks.

Design benchmarks for:

- **Latency**: time per operation with warmup and repeated samples;
- **Throughput**: operations, items, or bytes processed per unit of time with an explicit work unit;
- **Allocations**: bytes/op, objects/op, allocation count, allocation rate, or GC pressure when the existing platform harness supports it.

For every benchmark:

1. Reuse a correctness-tested public operation.
2. Keep setup outside the measured section unless setup is intentionally part of the workflow.
3. Include representative and boundary-relevant input sizes.
4. Prevent dead-code elimination using the framework's supported mechanism.
5. Include warmup for JIT runtimes when the framework supports it.
6. Configure multiple iterations or samples according to existing conventions.
7. Avoid I/O, clocks, randomness, logging, and unrelated setup inside microbenchmarks unless they are the target.
8. Keep environment-sensitive thresholds out of ordinary tests.
9. Prefer baseline comparison hooks already supported by the repository.

Do not invent an allocation metric the harness cannot collect. When allocation measurement is explicitly requested or part of the authorized benchmark suite, add a compatible benchmark-scoped profiler, plugin, adapter, or dependency when one exists and can be isolated from production. Mark allocation measurement as unsupported only when no compatible in-scope capability can be added without affecting production or leaving the requested scope.

Never place performance assertions in the coverage suite. Never generate fixed nanosecond or throughput thresholds without an existing calibrated baseline or explicit repository policy.
