
# Style Guide

This style guide is a set of guidelines for writing and editing documentation. It's important to follow these guidelines to ensure that our documentation is consistent and easy to read.

## General Guidelines

### Writing

- Use a friendly and conversational tone of voice.
- Use an active voice (vs. a passive voice).
- Avoid long paragraphs or sentences.
- Always use accurate and verified information.
- Maintain consistency in style across pages and sections.
- Assume the reader does not have a lot of context. Keep in mind that readers have different levels of expertise.
- Don't use *click here* or *read this document* for links. Just link [the thing](https://en.wikipedia.org/wiki/The_Thing_(1982_film)) in context.
- Don’t use double negatives.

### Words

- Use second-person perspective (use *you*).
- Use American English.
- Use simple (but accurate) words.
- Avoid slang, jargon, or making up new words. Everything should be easy to translate into major languages.
- Avoid gendered words or pronouns like “his”, “her”, “manned”, etc.
- Define acronyms and abbreviations on first usage and if they're used infrequently.
- Use italics or bold text to emphasize a word. Avoid using all capital letters.
- Avoid using words that indicate time like “new feature”, as it may fall out-of-date quickly.
- Avoid the word “please” in an instruction.
- Avoid violent words.
- Don’t use offensive language.

### Code

- Use code examples whenever possible.
- Always specify the language of a code block.
- Avoid hard-coded examples, and instead import code examples from code that is routinely tested.
- Use comments to define code examples to be imported instead of line numbers that may change.
- Always wrap inline code in backticks.
- Always use code fences when showing commands and separate commands from console outputs. The user should be able to copy and paste the entire code in the code fence.
- Use descriptive variable names in code examples. Don’t use `foo` , `bar` , `baz` , etc.

### Organizing Information

- Use the standard HTML heading hierarchy: The first line should be an `h1` (use 1 # in markdown) and should be the only `h1` on the page. The subheadings shouldn’t skip a level, e.g. `h3` tags should only be inside `h2` tags.
- Organize information so that readers can skim the page and get an answer for the most common questions quickly. Use subheadings to call out important information, and use a blockquote to identify supplemental information.
- Avoid using tables.

### Graphics

- Don’t create complex flow-charts (having more than 5-6 items).
- Don't use images of text or code. Use the actual text or code in markdown format.

### Lists

- Use numbers, number-letter combinations (1.a, etc.), or bullet points for lists. Do not use Roman numerals or letters alone.

## Guides

If you are writing for a guide or the `intro` section, follow these additional guidelines:

### Components

To maintain accuracy and consistency, it is recommended to use the available React components within a guide whenever they apply. For example:

- Use the `CodeImport` and `TextImport` components instead of copying and pasting code or text.
- For images, use the `Box.Centered` component to center the image.
- For content only applicable to a certain version of the docs, use the `ConditionalContent` component.

You can find examples for how to these components within the [`docs/guides/docs`](https://github.com/FuelLabs/docs-hub/tree/master/docs/guides/docs) folder.

For a full list of components available, see the [`src/components/MDXRender.tsx`](https://github.com/FuelLabs/docs-hub/blob/master/src/components/MDXRender.tsx) component.

### Variables

There are several variables passed into the MDX context that you can use within a guide. You can find a full list in the [`src/components/MDXRender.tsx`](https://github.com/FuelLabs/docs-hub/blob/master/src/components/MDXRender.tsx) component.

You can then use these variables within a guide like so:

```mdx
The faucet URL is {props.faucetUrl}
```

Which would render as:
The faucet URL is {props.faucetUrl}
