---
sidebar_position: 3
---
# Maximum Compressed Size
Returns the maximum potential size of the uncompressed data when compressed.

It's recommended to use this size when compressing and then resizing the buffer according the size returned by the native Oodle compress function.

## Options
`Oodle.maxCompressedSize(`
- `srcSize`: [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)
  - The size of the content to decompress. This often is just `src.length` unless you are using offsets.
- [`compressor`](../constants/compressor): Defaults to `Kraken (8)`.
  - The compression algorithm to use.

`)`

## Returns
[Buffer](https://nodejs.org/api/buffer.html#class-buffer)