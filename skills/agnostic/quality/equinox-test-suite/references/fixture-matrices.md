# Declarative fixture matrices

Keep each matrix under the existing test resources, grouped by behavior or domain. Reuse the repository's schema and decoder where suitable. JSON describes data; Kotlin owns fixture setup, public API/UI actions, assertions, and cleanup through the existing lifecycle.

## Describe the contract

Each logical case needs a stable unique ID, required initial conditions, operation inputs, and independently known expected outcomes. Include persistent effects and required absences when relevant. Choose fields for the tested contract rather than imposing one universal schema or case count.

Use synthetic values and symbolic references for actors, related records, and payloads. Resolve runtime IDs from verified API responses. Keep paths relative to owned fixture locations; obtain environment addresses, device selection, and credentials through the existing external configuration.

Declare expected outcomes from the established contract. Keep application algorithms out of the decoder and expected-value generation. For dynamic values, assert the required format or relationship in Kotlin.

## Consume through native tests

- Decode into typed test data with existing serialization support where possible. Validate required fields and types, any declared schema version, unique IDs, references, safe resource paths, and bounded payload sizes before fixture setup. Identify the case and invalid field on failure.
- Share data across targets or test levels only where they exercise the same contract. Keep boundary-specific assertions in their tests; a shared expected value does not make integration coverage equivalent to a UI journey.
- Verify resource loading for every selected consumer. Shared placement alone does not prove mobile or Web availability; isolate unavoidable technical differences in existing test source sets.
- Use parameterization supported by the installed runner so each logical case has a stable name and a separate reported result. Verify discovery through the official task; report unsupported discovery as a runner blocker under the existing stack contract.
- Keep local and CI execution on the normal test task and reports. Matrix adoption does not require a CI parser, wrapper, custom task, or alternate runner.

Apply the shared fixture readiness and validation rules to the selected consumers. Validate the matrix and referenced resources within the authorized execution mode; distinguish static review from runtime loading and execution. Report logical cases separately from target executions and identify blocked or unreached assertions.
