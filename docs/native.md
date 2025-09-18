---
sidebar_position: 3
---
# Native Functions
We provide js callable functions directly mapped to the native functions via koffi.

We **do not recommend** using them neither will we provide any more help than this documentation.

## Accessing
You can access each of the functions on your Oodle instance:
- `nativeDecompress`
- `nativeCompress`
- `nativeMaxCompressedSize`

:::note
These functions will not appear in intellisense by design but they will have intellisense for the options when accessed.
:::

## Options
Each function takes a set of options, you can use intellisense to make sense of them.

If you're more interested in the way they're defined internally in koffi:
### nativeDecompress
  - **Options**
    - **src:** `uint8*`
    - **srcLen:** `int`
    - **dst:** `uint8*`
    - **dstSize:** `size_t`
    - **decoderFlags:** `int`
    - **threadPhase:** `int`
    - **fuzzSafe:** `int`
    - **decoderMemory:** `void*`
    - **decoderMemorySize:** `int`
    - **scratch:** `void*`
    - **scratchEnd:** `void*`
    - **checkBuf:** `void*`
    - **checkBufSize:** `size_t`
    - **verbosity:** `int`
  - **Returns:** `int` - The size of the uncompressed data.

### nativeCompress
  - **Options**
    - **compressor:** `int`
    - **src:** `uint8*`
    - **srcLen:** `size_t`
    - **dst:** `uint8*`
    - **dstSize:** `int`
    - **options:** `void*`
    - **dictionaryBase:** `void*`
    - **scratch:** `void*`
    - **scratchEnd:** `void*`
    - **level:** `size_t`
  - **Returns:** `int` - The size of the compressed data.

### nativeMaxCompressedSize
  - **Options**
    - **compressor:** `int`
    - **srcLen:** `int`
  - **Returns:** `int` - The maximum potential size of the uncompressed data when compressed.
