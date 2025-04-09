# Date conversion

To allow for easier manipulation of date and time, the SDK exports the `DateTime` class which is a wrapper around the [built-in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) `Date` class. Below we will go over the methods of instantiation, utility functions and time formats.

Internally the transactions and other time/date assets are encoded using the [`TAI64`](#tai-format) format. We return a `DateTime` class, to allow of easier conversion and formatting between the two formats.

## Instantiating a `DateTime`

We have a host of static method for **instantiation** of our `DateTime` class.

```ts\nimport { DateTime } from 'fuels';

const tai64: DateTime = DateTime.fromTai64('4611686020108779339');
const unixSeconds: DateTime = DateTime.fromUnixSeconds(1681391398);
const unixMilliseconds: DateTime = DateTime.fromUnixMilliseconds(1681391398000);\n```

### TAI64

`fromTai64` is a _static_ method, that allows the creation of `DateTime` class from a `TAI64` string.

`toTai64` is an _instance_ method, that allows the conversion of a `DateTime` class to a `TAI64` string.

```ts\nimport { DateTime } from 'fuels';

const date: DateTime = DateTime.fromTai64('4611686020108779339');

const tai64: string = date.toTai64();
// "4611686020108779339"\n```

### UNIX

`fromUnixMilliseconds` is a _static_ method, that allows the creation of `DateTime` class from a UNIX Milliseconds number.

`toUnixMilliseconds` is an _instance_ method, that allows the conversion of a `DateTime` class to a `UNIX` number in milliseconds.

```ts\nimport { DateTime } from 'fuels';

const date: DateTime = DateTime.fromUnixMilliseconds(1681391398000);

const unixMilliseconds: number = date.toUnixMilliseconds();
// 1681391398000\n```

`fromUnixSeconds` is a _static_ method, that allows the creation of `DateTime` class from a UNIX Seconds number.

`toUnixSeconds` is an _instance_ method, that allows the conversion of a `DateTime` class to a `UNIX` number in seconds.

```ts\nimport { DateTime } from 'fuels';

const date: DateTime = DateTime.fromUnixSeconds(1681391398);

const unixSeconds: number = date.toUnixSeconds();
// 1681391398\n```

### Date

The `DateTime` class extends the functionality of the `Date` object, so all method are available for your usages.

```ts\nimport { DateTime } from 'fuels';

const dateTime: DateTime = DateTime.fromUnixMilliseconds(1681391398000);

// Extends the Date object
const date: Date = dateTime;

// Date object methods
date.getTime(); // 1681391398000
date.toISOString(); // 2023-04-13T13:09:58.000Z
date.toDateString(); // Thu Apr 13 2023\n```

## Formats

Here we will go over the different date/time formats that we use in the SDK. Internally the blockchain uses the `TAI64` format, but we also support the `UNIX` format for ease of use.

### UNIX Format

UNIX time is the number of seconds that have elapsed since **00:00:00 Coordinated Universal Time (UTC), Thursday, 1 January 1970**, minus leap seconds. Every day is treated as if it contains exactly 86400 seconds, so leap seconds are ignored.

### TAI Format

TAI stands for _Temps Atomique International_ and is the current international real-time standard [Source](https://cr.yp.to/libtai/tai64.html).

We use `TAI64` is a 64-bit integer representing the number of nanoseconds since the epoch.

- the TAI second beginning exactly _(2^62 - s) seconds_ before the beginning of 1970 TAI, if s is between 0 inclusive and 2^62 exclusive; or

- the TAI second beginning exactly _(2^62 + s) seconds_ after the beginning of 1970 TAI, if s is between -2^62 inclusive and 0 exclusive.

[Source](https://cr.yp.to/libtai/tai64.html)
