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
if (oodle.maxCompressedSize(data.length, OodleCompressor.Kraken) > data.length) return console.log("not worth compressing") // Check compression size before
const compressed = await oodle.compress(data);
const decompressed = await oodle.decompress(compressed, compressed.length, 0 /* source offset */, Buffer.allocUnsafe(data.length), data.length, 0 /* dest offset */);
console.log(decompressed.toString()) // "Hello, World:" x50
```

> [!IMPORTANT]
> You should check if the compressed size will be bigger than uncompressed using `Oodle.maxCompressedSize()` before compressing.
> There are other compressors that Oodle offers.
> Check out more options below

### CJS import
```js
const Oodle = require("oodle.js").default
```

## Options
### Oodle.constructor
- `pathOrClearCache`:
    - `string`: path to lib
    - `boolean`: whether to clear cache when downloading the lib
    - Defaults to `false`
- `warn`: `boolean`, whether to warn if compressed size will be bigger than uncompressed

### Oodle.compress
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

### Oodle.decompress
- `src`: `Buffer`,
- `compressor`: `OodleCompressor` defaults to `OodleCompressor.Kraken`
- `level`: `OodleCompressionLevel` defaults to `OodleCompressionLevel.Optimal`

### Check JSDoc for more info on:
- OodleFuzzSafe
- OodleCheckCRC
- OodleVerbosity
- OodleDecodeThreadPhase
- OodleCompressor
- OodleCompressionLevel

## OodleError
Just an Error with a `isOodleError()` method that returns true.