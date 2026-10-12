# Personal KDoc and Javadoc Style

Treat every value inside angle brackets as an instruction to replace, never as literal output.

## Contents

- [Shared voice and layout](#shared-voice-and-layout)
- [Contract depth](#contract-depth)
- [Punctuation and paragraphs](#punctuation-and-paragraphs)
- [Codebase indentation](#codebase-indentation)
- [Javadoc templates](#javadoc-templates)
- [KDoc templates](#kdoc-templates)
- [Semantic special cases](#semantic-special-cases)

## Shared voice and layout

- Write documentation in English.
- Start type summaries with `The ...`; start constructor summaries with `Constructor to init ...`; start method summaries with `Method used to ...` or, for a named operation, `Method to perform ...`.
- Prefer the user's recognizable vocabulary, but use grammatically correct and semantically truthful descriptions.
- Omit only the trailing period of each summary, tag description, or prose paragraph. Use normal punctuation, including periods between sentences; the final-period convention must never produce run-on prose.
- Start `@param` descriptions with a capital letter, commonly `The ...`.
- Start `@return` descriptions with lowercase `the ...` or `whether ...`.
- End typed return descriptions with the exact shape `as <type link>`; do not insert `a` or `an` between `as` and the linked type.
- Keep tags of the same kind adjacent. Insert one blank documentation line between the description and tags, between parameters and returns, and before `@since`.
- Wrap long prose naturally at the project's existing line width. Do not reflow unrelated comments.
- Describe observable purpose and contract rather than narrating individual implementation statements.

Use these summary patterns according to the declaration:

```text
The <Type> class is useful to <purpose>
The <Type> object allows to <capability>
The <Type> interface defines the contract to <purpose>
The <Type> enum is useful to represent <concept>
The <Type> annotation is useful to mark <target or behavior>
Constructor to init the <Type> class
Method used to <action>
Method to perform <named operation>
Method used to get the <property> instance
Method used to set the <property> instance
Method used to check whether <condition>
```

## Contract depth

Apply the completeness criteria in `SKILL.md` to summaries, detail paragraphs, and tags together. Put each fact where it is most useful rather than repeating it in all three. Explain parameter meaning, units, valid ranges, null or empty cases, and result guarantees when relevant and verified; a type name alone does not explain a value's role.

For a function that uses one-based page numbers, rejects values below one, preserves source ordering, and returns an empty list past the available results:

- Too shallow: `Method used to get items`
- Too procedural: `Method used to check the page number, calculate the offset, call the repository, and return its list`
- Appropriate depth, assuming these behaviors and types have been verified:

```kotlin
/**
 * Method used to retrieve the items in the requested page
 *
 * Items retain the source ordering. An empty list is returned when the page
 * exceeds the available results
 *
 * @param page The one-based page number
 *
 * @return the items in the requested page as [List] of [Item]
 * @throws IllegalArgumentException if [page] is less than one
 */
```

The example illustrates contract selection, not a required paragraph count or pagination behavior to copy. Preserve important details for more complex contracts; omit extra prose when the summary and tags already explain a simple declaration fully.

## Punctuation and paragraphs

- Keep the opening summary focused. Put supporting details in separate paragraphs, each developing one coherent aspect of the contract; start another paragraph when the subject changes. Do not split every sentence mechanically or add empty sections to simple comments.
- Use full stops between independent sentences and commas within a sentence where grammar requires them. Avoid chaining unrelated conditions with commas, semicolons, or repeated `and` merely to avoid periods. The omitted final period applies only to the end of the text unit, not to every sentence inside it.
- Separate KDoc paragraphs with a blank documentation line containing only the indented `*`. For Javadoc prose, also begin each paragraph after the summary with `<p>` so the separation appears in generated HTML; a blank source line alone does not create an HTML paragraph. Keep block tags outside those prose paragraphs.
- Wrap lines for the local line width, but do not treat wrapping as sentence or paragraph structure: rendered documentation can join consecutive source lines. Use lists only for genuinely parallel conditions or alternatives, with KDoc Markdown or Javadoc HTML appropriate to the renderer.

## Codebase indentation

- Read the target declaration, nearby documentation at the same nesting level, and applicable indentation or line-width settings when needed. Use the declaration's exact leading whitespace as the block's base prefix; preserve tabs as tabs and spaces as spaces rather than assuming a fixed indentation width.
- Place `/**` at that base prefix and use it for every following documentation line, adding the local `*` and closing-delimiter alignment. If no nearby convention exists, use `prefix + "/**"`, `prefix + " * text"`, and `prefix + " */"`. Keep documentation before existing annotations without moving or reindenting them.
- Follow the local continuation indentation for wrapped prose and tags, and the file's existing line endings. Wrap within the codebase's line width after accounting for nesting; change only documentation text. Template examples show tag structure, not literal source indentation.
- Preserve all pre-existing whitespace outside documentation delimiters. When inserting a block, add its own complete lines and leave the following source line intact; never reuse its indentation in a way that leaves the declaration unindented or doubles its prefix. Do not run a formatter to obtain this layout.

## Javadoc templates

Use `{@code ...}` for the documented type name, field name, primitive, literal, or short code fragment. Use `{@link Type}`, `{@link #member}`, or `{@link Type#member}` for navigable declarations.

### Type

```java
/**
 * The {@code TypeName} class is useful to <purpose>
 *
 * <p><optional detail paragraph>
 *
 * @author <exact author value>
 * @see RelatedType
 * @see AnotherRelatedType
 *
 * @since <release resolved before the documentation round>
 */
```

Omit unused optional paragraphs and tags together with their surrounding blank lines. Keep Java `@author` and `@see` lines adjacent, as in the supplied Java style. Put `@since` last when present.

For other type kinds, replace `class` with `interface`, `enum`, `record`, or `annotation` and choose the matching shared summary pattern.

### Field

```java
/**
 * {@code fieldName} the <meaning or role of the field>
 */
```

### Constructor

```java
/**
 * Constructor to init the {@link TypeName} class
 *
 * @param first  The <meaning of first>
 * @param second The <meaning of second>
 */
```

Align Java parameter descriptions within the same tag block when this does not conflict with the repository formatter.

For a framework-required empty constructor, add only when true:

```java
 * @apiNote empty constructor required
```

### Method

```java
/**
 * Method used to <action and relevant context>
 *
 * @param input The <meaning of input>
 *
 * @return the <result> as {@link ResultType}
 */
```

Use these return forms where appropriate:

```java
 * @return whether <condition> as {@code boolean}
 * @return the {@link #fieldName} instance as {@link List} of {@link ItemType}
```

Use `@param <T>` for Java type parameters and `@throws ExceptionType` only for exceptions that belong to the declared or documented contract. Omit `@return` for constructors and `void` methods.

## KDoc templates

Use backticks for the documented type name, literals, acronyms, and conceptual code terms such as `JVM`, `DEK`, or `Base64`. Use `[Type]`, `[member]`, or `[Type.member]` for declarations that should be linked.

### Type or object

```kotlin
/**
 * The `TypeName` object allows to <capability>
 *
 * <optional detail paragraph using [RelatedType] links>
 *
 * @param input The <meaning of a primary-constructor parameter>
 * @property state The <meaning of a primary-constructor property>
 *
 * @author <exact author value>
 *
 * @see RelatedType
 * @see AnotherRelatedType
 *
 * @since <release resolved before the documentation round>
 */
```

Use the corresponding `class`, `interface`, `enum`, or `annotation` summary for other Kotlin declaration kinds. Omit the primary-constructor tag group when it is not applicable. Keep constructor tags, `@author`, `@see`, and `@since` as separate groups divided by blank documentation lines.

### Property

```kotlin
/**
 * `propertyName` the <meaning or role of the property>
 */
```

For primary-constructor properties, prefer `@property propertyName ...` in the type KDoc when a standalone property comment cannot be attached naturally. Use `@param parameterName ...` for constructor parameters that are not properties.

### Secondary constructor

```kotlin
/**
 * Constructor to init the [TypeName] class
 *
 * @param input The <meaning of input>
 */
```

### Function

```kotlin
/**
 * Method used to <action and relevant context>
 *
 * @receiver The <role of the extension receiver>
 * @param input The <meaning of input>
 *
 * @return the <result> as [ResultType]
 */
```

Include `@receiver` in this position for every Kotlin extension function. Omit it only when the declaration has no extension receiver.

For an extension property, use:

```kotlin
/**
 * `propertyName` the <meaning or role of the property>
 *
 * @receiver The <role of the extension receiver>
 */
```

Use these return forms where appropriate:

```kotlin
 * @return whether <condition> as [Boolean]
 * @return the [propertyName] instance as [List] of [ItemType]
```

Use one space after each KDoc parameter name; do not vertically align KDoc parameter descriptions. Use `@param T` for type parameters. Always document the declaration receiver of every Kotlin extension function or extension property with `@receiver`, whether the extension is top-level or a member and whether the receiver's role seems obvious. A function-type parameter with receiver, such as `T.() -> R`, remains a parameter and is documented with `@param`; it does not create an `@receiver` tag unless the containing declaration is itself an extension. Omit `@return` for `Unit` functions. Add `@since` last, separated from the preceding tag group by one blank documentation line.

## Release and inheritance tags

Follow the release selection, branch reuse, placement, and inheritance rules in `SKILL.md`. Template tags are conditional: a new type carries its initial members' `@since`; additions to an existing type carry their own introduction version. `@see` tags are permitted only on classes; omit the group when adapting a template to any other declaration kind. Include direct superclass and interface references, and only essential indirect ancestors. Never add `@see` on members or overrides. Keep one entry per ancestor and preserve the language-specific tag grouping above

For example, if `NewType` and its initial members arrive in release `2.4.0`, only `NewType` receives `@since 2.4.0`. If `ExistingType` was introduced in `2.0.0` and gains `newOperation` in `2.4.0`, retain the type's historical tag and add `@since 2.4.0` only to `newOperation`. If `Child` extends `Base`, which extends `Root` and implements `Contract`, list `Base` in `Child`'s `@see` group; add `Root` or `Contract` only if its contract is essential to understanding `Child`. Do not reproduce the complete chain automatically. These names and versions illustrate placement only

## Semantic special cases

- Describe getters as retrieving the backing property only when they actually expose that value; describe transformations explicitly.
- Describe predicates with `whether ... as {@code boolean}` or `whether ... as [Boolean]`.
- Describe wrappers and delegates by their caller-visible action, not merely by saying they call another method.
- Mention encryption, persistence, network, blocking, suspension, mutation, caching, or validation only when confirmed by code or contract.
- Preserve meaningful existing detail paragraphs and tags after correcting their syntax and facts.
- Do not turn grammar problems or copied parameter descriptions from style samples into reusable rules.
