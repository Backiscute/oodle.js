---
sidebar_position: 1
---

# Getting Started

`Oodle.js` is a wrapper around the `Oodle` compression library by RAD Games.

It also offers a downloader for Oodle to facilitate using the wrapper.

It is largely inspired by [Oodle.NET](https://github.com/NotOfficer/Oodle.NET).

## What you'll need

- [Node.js](https://nodejs.org/en/download/) version 18.0 or above.
- [Oodle](./gettingoodle.md)

## Install to a new or existing project

You can install the latest version by using the following command:

```bash
npm install oodle.js
```

## Using in your project

### Importing the wrapper:

#### CommonJS
```js
const Oodle = require("oodle.js")
```

#### Typescript / ESM
```js
import Oodle from "oodle.js";
```
Or
```js
import * as Oodle from "oodle.js";
```

### Initialize the library
```js
const oodle = new Oodle();
await oodle.init();
```

You can also initialize it in a one liner:
```js
const oodle = await new Oodle().init();
```

#### Options
The `Oodle` constructor takes one option which can either be:
- `undefined`: Automatically downloads `Oodle` for your current platform.
- `boolean`: Automatically downloads `Oodle` for your current platform but specifies whether or not to clear the cache.
  - We recommend using this option and setting it to `true` if you ever encounter an error related to the `Oodle` library.
- `string`: Loads the `Oodle` library from the path your provided.
  - **MUST BE AN ABSOLUTE PATH**
