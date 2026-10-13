---
name: write-kj-doc
description: "Write, complete, normalize, or review Kotlin KDoc and Java Javadoc for declarations and members, role-aware blueprints, or signature/behavior checks, using the personal English style."
---

# Write KDoc and Javadoc

Document Kotlin and Java code with concise, semantic comments based on the user's personal templates. Preserve the recognizable wording and layout while correcting factual or copy-and-paste mistakes.

## Enforce the documentation-only boundary

- Insert or edit only KDoc and Javadoc blocks delimited by `/**` and `*/`.
- For a newly inserted standalone documentation block, add only the indentation and line endings needed for its own lines, following the codebase. Preserve every pre-existing character outside the block, including the following annotation or declaration's indentation; do not consume or duplicate that indentation when inserting the comment.
- The sole exception is an ordinary source comment explicitly marked with the exact, case-sensitive prefix `TODO: INGEST -` after its comment delimiter. Read its payload as documentation input and remove that marked comment after ingesting it as defined below.
- Treat every other pre-existing character outside documentation blocks as immutable, including package declarations, imports, annotations, modifiers, identifiers, types, signatures, default values, property initializers, method bodies, string literals, all unmarked comments and TODOs, and whitespace or line wrapping.
- Never add, remove, reorder, or rewrite imports or annotations to support a documentation link. Use a resolvable fully qualified link or non-linked code text inside the documentation instead.
- Never fix compiler errors, bugs, unsafe calls, nullability, naming, spelling in identifiers, deprecations, style issues, or formatting discovered while documenting. Report them separately without editing them.
- Never run an autoformatter, import optimizer, code generator, or other command that may rewrite target source files.
- If the user requests documentation and code changes together, keep this skill's execution documentation-only, including the explicit ingest-marker exception, and separate the code-change request from this workflow. Do not treat the documentation request as authorization to edit code.
- If accurate documentation exposes a conflict or ambiguity in the implementation, document only facts that are provable and report the conflict. Never change the implementation to match the intended documentation.

## Ingest explicitly marked TODO comments

- Recognize only ordinary line or block comments whose comment text begins with the exact marker `TODO: INGEST -`, allowing only whitespace between the comment delimiter or leading block-comment `*` and the marker. Examples include `// TODO: INGEST - explain retry behavior` and `/* TODO: INGEST - explain retry behavior */`.
- Do not ingest spelling variants, different casing, TODOs with text before the marker, or unmarked comments. Leave all of them byte-for-byte unchanged.
- During analysis, associate each ingest marker with the declaration it explicitly names; otherwise associate it with the nearest following declaration in the same lexical scope. Interpret the payload as author-provided intent, then verify and refine it against the signature, implementation, and directly related code before using it. Never copy an instruction that would make the documentation false.
- Incorporate every supported fact or requirement from the payload into the relevant KDoc or Javadoc in the configured English style. The marker is input, not text to reproduce: never emit `TODO`, `INGEST`, or the raw instruction syntax in the resulting documentation unless those terms are genuinely part of the documented contract.
- Remove the entire marked line comment or block comment automatically once its usable content has been incorporated. Remove only the marker comment itself; preserve surrounding whitespace, indentation, line endings, adjacent comments, and code exactly.
- If a marked payload is empty, ambiguous, contradicts the code, targets no identifiable declaration, or cannot be truthfully incorporated, leave that marker unchanged and report why. Never silently discard documentation intent.

## Load the style reference

Read [references/style-guide.md](references/style-guide.md) completely before drafting or reviewing comments. Apply the language-specific templates and tag order from that file.

Load only the role references that match the target code:

- Read [references/ui-blueprints.md](references/ui-blueprints.md) for UI components, composable functions, screens, presenters, ViewModels, state holders, or UI sections.
- Read [references/service-blueprints.md](references/service-blueprints.md) for service clients, requesters, gateways, remote operations, payload or query builders, endpoint assemblers, and general helpers.
- Read both when one file genuinely contains both roles. Use only the base style guide when neither role fits.

## Keep every blueprint independent

- Infer roles from the target declaration, annotations, inheritance, implementation, and call sites; never classify code solely because its name resembles a sample.
- Treat blueprint text as a sentence family to fill from the target contract, not as domain content to copy.
- Never introduce product names, package names, base classes, annotations, services, state models, endpoints, resources, or workflows taken from examples.
- Never require a particular architecture. A screen does not automatically need a ViewModel, and a ViewModel does not automatically perform networking or own session state.
- Fall back to the base declaration template when no specialized role matches cleanly.

## Balance completeness and detail

- Make each comment sufficient to understand the declaration's purpose and use without reading its body. Include verified input constraints, result semantics, relevant effects, and failure or callback conditions when they affect correct use; these are selection criteria, not mandatory sections for every declaration.
- Start with a focused summary and add detail only where it clarifies the contract. A simple declaration can need only a summary and applicable tags; a complex one must not lose important guarantees or limitations to satisfy an arbitrary length limit.
- Do not paraphrase the name as the entire explanation or narrate assignments, branches, loops, local variables, and internal call sequences. Mention an implementation detail only when it explains a relevant observable behavior or constraint.
- Preserve useful existing contract information while removing repetition. Covering every requested member does not require equally long comments. Apply the examples and indentation rules in the base style guide to every blueprint.

## Follow this workflow

1. Read each target file completely, inventory every exact `TODO: INGEST -` marker in scope, and treat its payload as analysis input. Read directly related declarations, base types, callers, or callees when needed to understand the real contract and declaration role. Before editing, record the current target-file diff or preserve a read-only baseline so pre-existing user changes remain distinguishable.
2. Confirm the requested scope from the prompt. When the user asks for a class and every method, cover the type, fields or properties, constructors, and every explicit method or function in scope, including simple wrappers and non-public members.
3. Resolve optional metadata before editing:
   - Preserve an existing `@author` value unless the user requests a change.
   - Use an author supplied in the current request exactly as written.
   - Add `@author` to type declarations by default, not to fields, properties, constructors, methods, functions, or top-level UI components. Preserve a broader existing convention or follow an explicit user request when one applies.
   - When adding type-level documentation and no author value is available, ask once for the exact `@author` value or permission to omit it. Never reuse identities from examples or neighboring projects.
   - Resolve `@since` through the release workflow below before starting documentation edits
   - If interaction is unavailable, omit genuinely unresolved optional metadata and report it; never emit placeholders
4. Classify each declaration by its actual role, select the closest applicable blueprint, and derive every sentence from the implementation and contract. Treat samples as style evidence only; do not copy their domain facts.
5. Inspect the declaration's exact indentation and nearby documentation layout, then apply narrow patches that insert or replace documentation blocks and remove successfully ingested marker comments only. Do not include surrounding source lines in a replacement when they do not need to change.
6. Compare the edited files with the recorded baseline and reject any newly introduced difference outside KDoc or Javadoc blocks except their newly inserted line indentation and endings and the exact deletion of successfully ingested `TODO: INGEST -` comments. Correct only accidental changes made by this workflow and preserve all pre-existing user changes.
7. Validate the result against the checklist below. Run an existing focused KDoc, Dokka, Javadoc, or doclint task only when it cannot rewrite target sources and is readily available and proportionate; do not alter the build merely to validate comments.

## Resolve release and class metadata

Before editing, read [release metadata](references/metadata.md#resolve-the-release-and-place-since) for the release proposal and `@since` placement. When documenting classes or reviewing tags, also read [class-only see rules](references/metadata.md#resolve-class-only-see-entries). Reuse applicable proposals and historical evidence; unresolved optional metadata remains omitted/reported rather than fabricated.

## Validate every comment

- Inspect the final diff against the pre-edit baseline. Additions and replacements must stay within `/** ... */` blocks, allowing only the indentation and line endings of newly inserted documentation lines outside the delimiters; every removal outside a block must be the complete text of a successfully ingested `TODO: INGEST -` comment.
- Confirm that each removed ingest marker contributed usable information to the intended documentation and that no successfully incorporated marker remains.
- Fail the documentation-only check if any source token, unmarked comment or TODO, blank line, indentation, or line wrapping outside a documentation block changed.
- Do not claim that code was preserved when the baseline comparison is unavailable or ambiguous; stop and report the verification problem instead.
- Use valid `/** ... */` source comments with one leading `*` per content line.
- Keep descriptions in English and concise. Omit only the trailing period of each summary, paragraph, or tag description; use normal punctuation between sentences, following the base style guide.
- Check prose for readability: separate distinct concepts into paragraphs, punctuate independent sentences, and verify that paragraph breaks survive documentation rendering. Source line wrapping alone is not paragraph separation.
- Check that the comment explains the useful contract without either a step-by-step implementation account or a generic restatement of the declaration name.
- Verify that each inserted block uses the declaration's exact indentation prefix and the local documentation layout, and that existing declaration and annotation indentation remains byte-for-byte unchanged.
- Document parameters in signature order and with their exact names.
- Add `@return` only for an actual non-`void` or non-`Unit` result. Resolve inferred Kotlin return types from the implementation or callee before deciding.
- Document type parameters and thrown exceptions only when they are part of the real contract. For every Kotlin extension function or extension property, always include an `@receiver` tag describing the role of the declaration's receiver, even when that role appears obvious.
- Make every Java `{@link ...}` and KDoc `[...]` target resolvable in context.
- Verify that `@see` tags occur only on classes, contain no duplicate targets, and include indirect ancestors only when essential to understanding the class
- Verify that the announced or reused `@since` matches the branch release and appears only at the introduction scopes defined above
- Never invent an author, version, revision, exception, side effect, nullability guarantee, or return type.
- Never leave a sample-specific identifier or architectural assumption in generated documentation.
- Remove stale statements and copied descriptions that contradict names, types, annotations, or behavior.
- Keep tag groups and blank lines exactly as defined in the language template, while preserving a stricter established convention when the target file already has one.

## Report the result

State which files or declarations were documented, how many `TODO: INGEST -` comments were incorporated and removed, which marked comments were preserved with a reason, which focused validation ran, and whether any optional metadata was intentionally omitted. State that no non-comment code changed only after the baseline comparison passes. Do not claim semantic correctness when related code could not be inspected.
