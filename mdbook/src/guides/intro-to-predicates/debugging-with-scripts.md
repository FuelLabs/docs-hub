
# Debugging with Scripts

In every aspect of development, trade-offs are inevitable. As previously mentioned, logging is not feasible when dealing with predicates, since predicates are required to be pure. This raises an important question: how do we debug predicates?

Sway, a programming language, categorizes programs into four types, with scripts being one of them. Unlike predicates, scripts allow for shared logic.

Let's move outside our MultiSig project

```sh
cd ../..
```

and create a separate project called `predicate-script-logging`.

<TestAction
id="create-predicate-script-logging"
action={{
  name: 'runCommand',
  commandFolder: 'guides-testing/'
}}
/>

```sh
forc new --predicate predicate-script-logging
```

Copy and paste this new predicate in your `src/main.sw`. Attempting to build this predicate will result in an error, indicating that logging is an invalid operation.

<CodeImport
  file="../../examples/intro-to-predicates/predicate-test-example/src/main.sw"
  comment="all"
  commentType="//"
  lang="sway"
/>

However, let's try switching the program type from a `predicate` to a `script`.

<CodeImport
  file="../../examples/intro-to-predicates/predicate-script-logging/src/main.sw"
  comment="program_type"
  commentType="//"
  lang="sway"
/>

Your code should now look like this:

<TestAction
id="sway-program-type"
action={{
  name: 'writeToFile',
  filepath: 'guides-testing/predicate-script-logging/src/main.sw'
}}
/>

<CodeImport
  file="../../examples/intro-to-predicates/predicate-script-logging/src/main.sw"
  comment="all"
  commentType="//"
  lang="sway"
/>

Now, if we attempt to build our script, it should compile without any issues.

<TestAction
id="build-predicate"
action={{
  name: 'runCommand',
  commandFolder: 'guides-testing/predicate-script-logging/'
}}
/>

```sh
forc build
```

Next, we'll generate a Rust template to see it in action!
