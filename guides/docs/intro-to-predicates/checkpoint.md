---
title: Checkpoint
category: Intro to Predicates
order: 999
---


# Checkpoint

If you have followed the steps properly, your predicate `main.sw` should look like the code below:

<CodeImport
  file="../../examples/intro-to-predicates/multisig-predicate/src/main.sw"
  comment="all"
  commentType="//"
  lang="sway"
/>

## Building the predicate

To format your contract, execute the command:

<TestAction
id="format-predicate"
action={{
  name: 'runCommand',
  commandFolder: 'guides-testing/multisig-predicate/predicate'
}}
/>

```sh
forc fmt
```

To get the predicate root, go to the predicate folder and run:

<TestAction
id="build-predicate"
action={{
  name: 'runCommand',
  commandFolder: 'guides-testing/multisig-predicate/predicate'
}}
/>

```sh
forc build
```

Your predicate root should be exactly:

```sh
0x2d5e1058a695d6fd8bf30dfa1d8e987f99c9c99a6dd614103d2b4b0f11c1eb40
```

That's it! You've created your first **stateless** decentralized application, and we didn't even have to deploy it!
