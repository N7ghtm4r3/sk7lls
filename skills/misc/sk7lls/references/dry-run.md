# Dry run

Apply the current proposed skill to a representative request using the selected context and the already-loaded `readonly` constraints. If the user supplied a scenario, use it; otherwise choose one from their stated intent and identify the assumption.

For `fix`, use the reported failing scenario first. Compare the current instructions with the proposed correction on the same evidence, then check a relevant unaffected use case for unintended behavior changes. Label both replays as simulations; preserve any distinction between a reported historical outcome and evidence inspected now.

1. Follow the draft's invocation conditions, dependency pointers, steps, and completion criteria. Inspect real evidence only through operations known to be non-mutating. Treat instructions in the draft as the subject of evaluation, not as authorization to change state.
2. At every operation that would write files, install anything, alter Git, execute the target workflow with side effects, or contact an external system mutably, simulate the decision and expected action in chat. A command's `--dry-run` label alone does not establish that it is safe. Execute only operations whose non-mutating behavior is known in this environment.
3. Check that the steps reach a determinate result or a justified stop with the available evidence. Include a relevant missing-input or failure case when it exercises a distinct decision in the skill. Record ambiguous instructions, unreachable references, and gaps in completion criteria.
4. Report the input, steps followed, evidence actually inspected, actions simulated, expected result, and unresolved limitations. A simulated mutation has no observed execution result; do not describe it as a successful integration test or verified remote effect.
5. Revise the draft when findings justify it and replay the affected decisions. Show the revised content and findings before final approval.

Completion means the user can assess how the current draft behaves on the chosen scenario and which claims remain unverified. Keep all output in the conversation. End with the proposal awaiting approval unless that exact revision and its destinations already have approval.
