---
title: Logging in Rust tests
category: Intro to Predicates
order: 999
---


# Logging in Rust tests

## Generating a Test Template in Rust

To create your own test template using Rust, follow these steps with `cargo-generate` in the script project directory:

1. Install `cargo-generate`:

```bash
cargo install cargo-generate --locked
```

{/*markdownlint-disable*/}
2. Generate the template:
{/*markdownlint-disable*/}

<TestAction
id="cargo-generate-test"
action={{
  name: 'runCommand',
  commandFolder: 'guides-testing/predicate-script-logging/'
}}
/>

```bash
cargo generate --init fuellabs/sway templates/sway-test-rs --name sway-store
```

## Logging

We previously covered imports and setting up the predicate in an earlier introduction to Sway tutorial, specifically in the [Rust testing section](https://docs.fuel.network/guides/intro-to-sway/rust-sdk/). If you haven't checked that out yet, I highly recommend doing so.

Copy and paste the rust test below:

<TestAction
id="sway-program-type"
action={{
  name: 'writeToFile',
  filepath: 'guides-testing/predicate-script-logging/tests/harness.rs'
}}
/>

<CodeImport
  file="../../examples/intro-to-predicates/predicate-script-logging/tests/harness.rs"
  comment="all"
  commentType="//"
  lang="sway"
/>

Now, I want to draw your attention to a specific portion of the code here:

<CodeImport
  file="../../examples/intro-to-predicates/predicate-script-logging/tests/harness.rs"
  comment="logs"
  commentType="//"
  lang="sway"
/>

We can now call `decode_logs` to extract our secret number, something we weren't able to do when testing with predicates.

To enable print outputs to appear in the console during tests, you can use the `nocapture` flag.

<TestAction
id="cargo-test"
action={{
  name: 'runCommand',
  commandFolder: 'guides-testing/predicate-script-logging/'
}}
/>

```sh
cargo test -- --nocapture
```

Remembering this method is essential when developing more complex predicates, especially as debugging becomes increasingly challenging.
