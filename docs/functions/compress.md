---
sidebar_position: 2
---
# Compress
Compresses the src buffer into a new dest buffer, returning a buffer containing the compressed data.

## Options
`Oodle.compress(`
- `src`: [Buffer](https://nodejs.org/api/buffer.html#class-buffer)
  - The buffer of the content to decompress.
- [`compressor`](../constants/compressor): Defaults to `Kraken (8)`.
  - The compression algorithm to use.
- [`compressionLevel`](../constants/compressionLevel): Defaults to `Optimal (6)`
  - The level of compression intended.

`)`

## Returns
[Buffer](https://nodejs.org/api/buffer.html#class-buffer)