---
title: Imports
category: Intro to Sway
order: 999
---


# Imports

The [Sway standard library](https://fuellabs.github.io/sway/master/std/) provides several utility types and methods we can use in our contract. To import a library, you can use the `use` keyword and `::`, also called a namespace qualifier, to chain library names like this:

<CodeImport
  file="../../examples/intro-to-sway/sway-store/sway-programs/contract/src/docs_hub_misc.sw"
  comment="import_single"
  commentType="//"
  lang="sway"
/>

You can also group together imports using curly brackets:

<CodeImport
  file="../../examples/intro-to-sway/sway-store/sway-programs/contract/src/docs_hub_misc.sw"
  comment="import_multi"
  commentType="//"
  lang="sway"
/>

For this contract, here is what needs to be imported. Copy this to your `main.sw` file:

<TestAction
id="sway-import"
action={{
  name: 'modifyFile',
  filepath: 'guides-testing/sway-store/sway-programs/contract/src/main.sw'
}}
/>

<CodeImport
  file="../../examples/intro-to-sway/sway-store/sway-programs/contract/src/main.sw"
  comment="import"
  commentType="//"
  lang="sway"
/>

We'll go through what each of these imports does as we use them in the next steps.
