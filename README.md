# Oodle.js
Simple library for oodle data compression/decompression.

Either pass a path to the lib or auto download latest release from [workingrobot/oodleue](https://api.github.com/repos/workingrobot/oodleue/releases/latest).

If you choose to download the library, it will be cached. Check out more below.

## Compatibility
- Windows: Works & Tested
- Linux: Works & Tested
- MacOS: Untested, should work

Please open a PR or issue if MacOS doesn't work.

## Usage Example
```ts
const oodle = await new Oodle().init();
const data = Buffer.from("Hello, World!".repeat(50))
const compressed = await oodle.compress(data);
const decompressed = await oodle.decompress(compressed, compressed.length, 0 /* source offset */, Buffer.allocUnsafe(data.length), data.length, 0 /* dest offset */);
console.log(decompressed.toString()) // "Hello, World:" x50
```

> [!NOTE]
> There are other compressors that Oodle offers.
> Check out more options below

### CJS import
```js
const Oodle = require("oodle.js").default
```

## Options
### Oodle.constructor()
- `pathOrClearCache`:
    - `string`: path to lib
    - `boolean`: whether to clear cache when downloading the lib
    - Defaults to `false`
- `warn`: `boolean`, whether to warn if compressed size will be bigger than uncompressed

### Oodle.compress(): `Buffer`
- `src`: `Buffer`
- `srcSize`: `number`
- `srcOffset`: `number`
- `dest`: `Buffer`
- `destSize`: `number`
- `destOffset`: `number`
- `advancedOptions`:
    - `fuzzSafe`: `OodleFuzzSafe`, defaults to `OodleFuzzSafe.Yes`
    - `checkCRC` `OodleCheckCRC.No`, defaults to `OodleCheckCRC.No`
    - `verbosity`: `OodleVerbosity.None`, defaults to `OodleVerbosity.None`
    - `decodeThreadPhase`: `OodleDecodeThreadPhase.Unthreaded`, defaults to `OodleDecodeThreadPhase.Unthreaded`

### Oodle.decompress(): `Buffer`
- `src`: `Buffer`,
- `compressor`: `OodleCompressor` defaults to `OodleCompressor.Kraken`
- `level`: `OodleCompressionLevel` defaults to `OodleCompressionLevel.Optimal`

### Oodle.maxCompressedSize(): `number`
- `srcSize`: `number`
- `compressor`: `OodleCompressor`

### Check JSDoc for more info on:
- OodleFuzzSafe
- OodleCheckCRC
- OodleVerbosity
- OodleDecodeThreadPhase
- OodleCompressor
- OodleCompressionLevel

## OodleError
- `name`: `OodleError`
- `isOodleError()`: true
