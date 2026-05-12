# Oodle.js
Simple library for oodle compression/decompression.

Either pass a path to the lib or auto download latest release from [workingrobot/oodleue](https://api.github.com/repos/workingrobot/oodleue/releases/latest).

If you choose to download the library, it will be cached. Check out more below.

## Compatibility
- Windows: Works & Tested
- Linux: Works & Tested
- MacOS: Untested

## Usage
```
const oodle = await new Oodle().init();
const decompressed = await oodle.decompress(...DecompressOptions);
const compressed = await oodle.compress(...CompressOptions);
```

## Options
### Oodle.constructor
Takes one argument that can be one of: 
- `string`: path to lib
- `boolean`: whether to clear cache when downloading the lib

Defaults to `false`

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