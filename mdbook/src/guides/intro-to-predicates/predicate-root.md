
# Predicate Root

Let's pause here for a moment and build the predicate at the root of the predicate folder.



```sh
forc build
```

Unlike building a contract, constructing the predicate generates an additional piece of information: an address that is hashed from the predicate code of your templated project, known as the **predicate root**. Since this process is cryptographic, any changes to the code will result in a change in the predicate root.

Since everyone is starting with the exact same templated code, the predicate root should be exactly this:

```sh
0x68fec7a57e48f4ec6467d7e09c27272bd8ca72b312ea553a470b98731475ccf3
```

Looking at the predicate, you can immediately notice several differences. There is no ABI or implementation, but simply a main function that returns true or false.

<CodeImport
  file="../../examples/intro-to-predicates/predicate-template/src/main.sw"
  comment="all"
  commentType="//"
  lang="sway"
/>

Notice that we have not "deployed" anything on the Fuel blockchain, yet we already have an address that we can interact with. It is important to remember this:

> Predicates are created, not deployed.
