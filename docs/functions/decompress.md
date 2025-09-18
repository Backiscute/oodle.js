---
sidebar_position: 2
---
# Decompress
Decompresses the src buffer into the dest buffer, returning a buffer containing the uncompressed data.

## Options
`Oodle.decompress(`
- `src`: [Buffer](https://nodejs.org/api/buffer.html#class-buffer)
  - The buffer of the content to decompress.
- `srcSize`: [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)
  - The size of the content to decompress. This often is just `src.length` unless you are using offsets.
- `srcOffset`: [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)
  - The offset from the beginning of the buffer.
- `dest`: [Buffer](https://nodejs.org/api/buffer.html#class-buffer)
  - The buffer to which the uncompressed content should be written.
- `destSize`: [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)
  - The intended size of the uncompressed content.
- `destOffset`: [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)
  - The offset from the beginning of the buffer to start writting.

- \{
  - [`fuzzSafe`](../constants/fuzzSafe)
  - [`checkCrc`](../constants/checkCrc)
  - [`verbosity`](../constants/verbosity)
  - [`decodeThreadPhase`](../constants/decodeThreadPhase)

  \}

`)`

## Returns
[Buffer](https://nodejs.org/api/buffer.html#class-buffer)