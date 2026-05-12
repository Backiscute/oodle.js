
# Oodle.js

Simple Node.js binding for **Oodle LZ compression/decompression** using native libraries via `koffi`.

It supports automatic library download or manual native DLL/SO loading.

AI was used to generate the README and jsdoc, code is human.

---

## Installation

```bash
npm i oodle.js@latest
```

---

## Compatibility

* Windows: Tested
* Linux: Tested
* macOS: Untested (should work)

---

## Quick Start

### Modern usage (current API)

```ts
import { Oodle } from "oodle.js";

const oodle = await Oodle.Create();

const input = Buffer.from("Hello, World!".repeat(50));

// Compress
const compressed = oodle.compress({
	buffer: input,
});

// Decompress
const decompressed = oodle.decompress(
	{
		buffer: compressed,
	},
	input.length
);

console.log(decompressed.toString());
```

---

## Creating an Instance

```ts
const oodle = await Oodle.Create();
```

### Custom library path

```ts
const oodle = await Oodle.Create("./native/oodle.dll");
```

### Clear download cache

```ts
const oodle = await Oodle.Create(true);
```

---

## Compression

```ts
const compressed = oodle.compress(
	{
		buffer: input,
		size: input.length,   // optional
		offset: 0,            // optional
	},
	OodleCompressor.Kraken,
	OodleCompressionLevel.Optimal
);
```

### Notes

* Returns a **trimmed Buffer**
* Automatically allocates output buffer using Oodle’s size estimator
* Throws `OodleError` on invalid ranges or failure

---

## Decompression

```ts
const output = oodle.decompress(
	{
		buffer: compressed,
		size: compressed.length,
		offset: 0,
	},
	originalSize
);
```

### Options

```ts
{
	fuzzSafe?: OodleFuzzSafe;
	checkCRC?: OodleCheckCRC;
	verbosity?: OodleVerbosity;
	decodeThreadPhase?: OodleDecodeThreadPhase;
}
```

---

## Utility Methods

### Get compressor type from buffer

```ts
const compressor = oodle.getCompressor(buffer);
```

---

### Maximum compressed size

```ts
const max = oodle.maxCompressedSize(1024, OodleCompressor.Kraken);
```

---

### Minimum decode buffer size

```ts
const size = oodle.minDecodeSize(
	buffer.length,
	OodleCompressor.Kraken,
	false
);
```

---

## Error Handling

```ts
try {
	oodle.compress({ buffer: input });
} catch (err) {
	if (err instanceof OodleError) {
		console.log(err.code);
	}
}
```

### OodleError

```ts
{
	name: "OodleError",
	message: string,
	code: string,
	isOodleError(): true
}
```

---

## Internal / Private API Notice

The following properties are **NOT part of the public API** and should not be used directly:

* `_lib`
* `_Compress`
* `_Decompress`
* `_GetAllChunksCompressor`
* `_GetDecodeBufferSize`
* `_GetCompressedBufferSizeNeeded`

### Why?

These are **direct native bindings** created via `koffi` and may change without notice.

Always use:

* `compress()`
* `decompress()`
* `maxCompressedSize()`
* `minDecodeSize()`
* `getCompressor()`

---

## Advanced Notes

* Compression level affects speed vs ratio
* Kraken is the default compressor (good balance)
* Buffer slicing is handled internally (`offset`, `size` supported)
* Native memory allocation is unsafe (`Buffer.allocUnsafe`) for performance

---

## Type Support

Check typings for:

* `OodleCompressor`
* `OodleCompressionLevel`
* `OodleFuzzSafe`
* `OodleCheckCRC`
* `OodleVerbosity`
* `OodleDecodeThreadPhase`

---

## Example: Full Pipeline

```ts
const oodle = await Oodle.Create();

const data = Buffer.from("example data".repeat(100));

const compressed = oodle.compress({ buffer: data });

const decompressed = oodle.decompress(
	{ buffer: compressed },
	data.length
);

console.log(decompressed.equals(data)); // true
```

---