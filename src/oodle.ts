import {
	OodleCheckCRC,
	OodleCompressionLevel,
	OodleCompressor,
	OodleDecodeThreadPhase,
	OodleFuzzSafe,
	OodleVerbosity,
	type NativeLib,
} from "./typings";
import { OODLE_PATH } from "./constants";
import { isAbsolute, resolve } from "node:path";
import download from "./downloader";
import koffi from "koffi";

export class Oodle {
	public _Decompress: NativeLib["Decompress"];
	public _Compress: NativeLib["Compress"];
	public _GetAllChunksCompressor: NativeLib["GetAllChunksCompressor"];
	public _GetDecodeBufferSize: NativeLib["GetDecodeBufferSize"];
	public _GetCompressedBufferSizeNeeded: NativeLib["GetCompressedBufferSizeNeeded"];

	private constructor(public _lib: koffi.IKoffiLib) {
		this._Decompress = _lib.func("OodleLZ_Decompress", "int", [
			"uint8*",
			"int",
			"uint8*",
			"size_t",
			"int",
			"int",
			"int",
			"void*",
			"int",
			"void*",
			"void*",
			"void*",
			"size_t",
			"int",
		]);

		this._Compress = _lib.func("OodleLZ_Compress", "int", [
			"int",
			"uint8*",
			"size_t",
			"uint8*",
			"int",
			"void*",
			"void*",
			"void*",
			"void*",
			"size_t",
		]);

		this._GetAllChunksCompressor = _lib.func(
			"OodleLZ_GetAllChunksCompressor",
			"int",
			["uint8*", "int", "int"],
		);

		this._GetDecodeBufferSize = _lib.func(
			"OodleLZ_GetDecodeBufferSize",
			"int",
			["int", "int", "bool"],
		);

		this._GetCompressedBufferSizeNeeded = _lib.func(
			"OodleLZ_GetCompressedBufferSizeNeeded",
			"int",
			["int", "int"],
		);
	}

	/**
	 * Creates an Oodle instance.
	 *
	 * Downloads oodle lib file according to the current os and architecture or uses the provided path to oodle lib file.
	 *
	 * @param pathOrClearCache - path to the oodle lib file to use, or a boolean to indicate whether to clear download cache
	 *
	 * @returns {Oodle}
	 */
	static async Create(pathOrClearCache: string | boolean = false) {
		let path: string;

		if (typeof pathOrClearCache === "string")
			path = isAbsolute(pathOrClearCache)
				? pathOrClearCache
				: resolve(process.cwd(), pathOrClearCache);
		else {
			await download(pathOrClearCache);
			path = OODLE_PATH;
		}

		const oodle = new Oodle(koffi.load(path));

		return oodle;
	}

	/**
	 * Compresses a buffer using the Oodle compression library.
	 * Uses `OodleLZ_Compress`.
	 *
	 * @param src - Source buffer options
	 * @param src.buffer - The source buffer containing compressed data.
	 * @param src.size - The number of bytes to read from the source buffer.
	 * @param src.offset - The byte offset in {@link src.buffer} where compressed data begins.
	 * @param compressor - The compression algorithm to use.
	 * See {@link OodleCompressor}. Defaults to {@link OodleCompressor.Kraken}.
	 * @param level - The compression level controlling speed versus compression ratio.
	 * See {@link OodleCompressionLevel}. Defaults to {@link OodleCompressionLevel.Optimal}.
	 *
	 * @returns A buffer containing the compressed data.
	 *
	 * @throws {OodleError} Throws if compression fails.
	 */
	compress(
		{
			buffer,
			size,
			offset,
		}: {
			buffer: Buffer;
			size?: number;
			offset?: number;
		},
		compressor: OodleCompressor = OodleCompressor.Kraken,
		level: OodleCompressionLevel = OodleCompressionLevel.Optimal,
	) {
		if ((offset ?? 0) < 0 || (offset ?? 0) + (size ?? 0) > buffer.length)
			throw new OodleError(
				`Invalid source buffer range: offset ${offset}, size ${size}, buffer length ${buffer.length}`,
				"src_range_invalid",
			);
		if (buffer.length <= 0)
			throw new OodleError(
				`Invalid source buffer length: ${buffer.length}`,
				"src_size_invalid",
			);
		if (size && size <= 0)
			throw new OodleError(
				`Invalid source buffer length: ${buffer.length}`,
				"src_size_invalid",
			);
		if (!OodleCompressor[compressor])
			throw new OodleError(
				`Invalid Oodle compressor: ${compressor}`,
				"compressor_invalid",
			);
		if (!OodleCompressionLevel[level])
			throw new OodleError(
				`Invalid Oodle compression level: ${level}`,
				"compress_level_invalid",
			);

		const src = this.crop(buffer, size, offset);
		const buf = Buffer.allocUnsafe(
			this._GetCompressedBufferSizeNeeded(compressor, src.length),
		);
		const outputSize = this._Compress(
			compressor,
			src,
			src.length,
			buf,
			level,
			null,
			null,
			null,
			null,
			0,
		);

		if (outputSize <= 0)
			throw new OodleError(
				`Oodle compression failed: An error occured while compressing`,
				"compress_size_invalid",
			);

		return buf.subarray(0, outputSize);
	}

	/**
	 * Decompresses Oodle-compressed data into a destination buffer.
	 * Uses `OodleLZ_Decompress`.
	 *
	 * @param src - Source buffer options
	 * @param src.buffer - The source buffer containing compressed data.
	 * @param src.size - The number of bytes to read from the source buffer.
	 * @param src.offset - The byte offset in {@link src.buffer} where compressed data begins.
	 * @param originalSize - The original uncompressed size of the data.
	 * @param options - Optional decompression settings.
	 * @param options.fuzzSafe - Enables fuzz-safe decompression behavior.
	 * See {@link OodleFuzzSafe}. Defaults to {@link OodleFuzzSafe.Yes}.
	 * @param options.checkCRC - Enables CRC validation during decompression.
	 * See {@link OodleCheckCRC}. Defaults to {@link OodleCheckCRC.No}.
	 * @param options.verbosity - Controls Oodle decompression logging verbosity.
	 * See {@link OodleVerbosity}. Defaults to {@link OodleVerbosity.None}.
	 * @param options.decodeThreadPhase - Controls the decode threading phase.
	 * See {@link OodleDecodeThreadPhase}. Defaults to {@link OodleDecodeThreadPhase.Unthreaded}.
	 *
	 * @returns A buffer containing the decompressed data.
	 *
	 * @throws {OodleError} Throws if decompression fails or the destination buffer is too small.
	 */
	decompress(
		{
			buffer,
			size,
			offset,
		}: {
			buffer: Buffer;
			size?: number;
			offset?: number;
		},
		originalSize: number,
		{
			fuzzSafe = OodleFuzzSafe.Yes,
			checkCRC = OodleCheckCRC.No,
			verbosity = OodleVerbosity.None,
			decodeThreadPhase = OodleDecodeThreadPhase.Unthreaded,
		} = {},
	) {
		if ((offset ?? 0) < 0 || (offset ?? 0) + (size ?? 0) > buffer.length)
			throw new OodleError(
				`Invalid source buffer range: offset ${offset}, size ${size}, buffer length ${buffer.length}`,
				"src_range_invalid",
			);
		if (buffer.length <= 0)
			throw new OodleError(
				`Invalid source buffer length: ${buffer.length}`,
				"src_size_invalid",
			);
		if (size && size <= 0)
			throw new OodleError(
				`Invalid source buffer length: ${buffer.length}`,
				"src_size_invalid",
			);
		if (!OodleFuzzSafe[fuzzSafe])
			throw new OodleError(
				`Invalid Oodle fuzz safe option: ${fuzzSafe}`,
				"fuzz_safe_invalid",
			);
		if (!OodleCheckCRC[checkCRC])
			throw new OodleError(
				`Invalid Oodle check CRC option: ${checkCRC}`,
				"check_crc_invalid",
			);
		if (!OodleVerbosity[verbosity])
			throw new OodleError(
				`Invalid Oodle verbosity level: ${verbosity}`,
				"verbosity_invalid",
			);
		if (!OodleDecodeThreadPhase[decodeThreadPhase])
			throw new OodleError(
				`Invalid Oodle decode thread phase: ${decodeThreadPhase}`,
				"decode_thread_phase_invalid",
			);

		const src = this.crop(buffer, size, offset);
		const compressor = this._GetAllChunksCompressor(
			src,
			src.length,
			src.length,
		);
		const buf = Buffer.allocUnsafe(
			this._GetDecodeBufferSize(compressor, originalSize, true),
		);

		const outputSize = this._Decompress(
			src,
			src.length,
			buf,
			buf.length,
			fuzzSafe,
			checkCRC,
			verbosity,
			null,
			0,
			null,
			null,
			null,
			0,
			decodeThreadPhase,
		);

		if (outputSize <= 0)
			throw new OodleError(
				`Oodle decompression failed: An error occured while decompressing, make sure originalSize is correct`,
				"decompress_size_invalid",
			);

		return buf.subarray(0, outputSize);
	}

	/**
	 * Detects the Oodle compressor used in a compressed buffer.
	 * Uses `OodleLZ_GetAllChunksCompressor`.
	 *
	 * This inspects the provided compressed data and returns the
	 * compressor type that was used to encode it.
	 *
	 * @param src - The compressed buffer.
	 * @param srcSize - Optional number of bytes to read from the buffer.
	 * If omitted, the full buffer length is used.
	 * @param srcOffset - Optional byte offset where compressed data begins.
	 *
	 * @returns The detected {@link OodleCompressor} type.
	 *
	 * @throws {OodleError} Throws if the buffer is empty or invalid.
	 */
	getCompressor(
		src: Buffer,
		srcSize?: number,
		srcOffset?: number,
	): OodleCompressor {
		const buf = this.crop(src, srcSize, srcOffset);
		return this._GetAllChunksCompressor(buf, buf.length, buf.length);
	}

	/**
	 * Estimates the maximum possible compressed size for a given input size
	 * using a specific Oodle compressor.
	 * Uses `OodleLZ_GetCompressedBufferSizeNeeded`.
	 *
	 * This is useful for preallocating output buffers before compression.
	 *
	 * @param srcSize - The size (in bytes) of the uncompressed input data.
	 * Must be greater than 0.
	 * @param compressor - The Oodle compressor to use.
	 * See {@link OodleCompressor}.
	 *
	 * @returns The maximum number of bytes that may be required
	 * to store the compressed output.
	 *
	 * @throws {OodleError} Throws if `srcSize` is invalid or
	 * if the compressor is not recognized.
	 */
	maxCompressedSize(srcSize: number, compressor: OodleCompressor) {
		if (srcSize <= 0)
			throw new OodleError(
				`Invalid source size: ${srcSize}`,
				"src_size_invalid",
			);
		if (!OodleCompressor[compressor])
			throw new OodleError(
				`Invalid Oodle compressor: ${compressor}`,
				"compressor_invalid",
			);
		return this._GetCompressedBufferSizeNeeded(compressor, srcSize);
	}

	/**
	 * Calculates the minimum buffer size required to safely decompress
	 * Oodle-compressed data.
	 * Uses `OodleLZ_GetDecodeBufferSize`.
	 *
	 * This helps ensure the destination buffer is large enough before
	 * calling `decompress()`.
	 *
	 * @param srcOrSize - Either a compressed buffer or its size in bytes.
	 * If a Buffer is provided, its length is used automatically.
	 * @param compressor - The Oodle compressor used for encoding.
	 * See {@link OodleCompressor}.
	 * @param corruptionPossible - Whether to account for potential
	 * corrupted input data. Defaults to `false`.
	 *
	 * @returns The minimum required decode buffer size in bytes.
	 *
	 * @throws {OodleError} Throws if the input size is invalid or
	 * if the compressor is not recognized.
	 */
	minDecodeSize(
		srcOrSize: Buffer | number,
		compressor: OodleCompressor,
		corruptionPossible = false,
	) {
		srcOrSize = Buffer.isBuffer(srcOrSize) ? srcOrSize.length : srcOrSize;
		if (srcOrSize <= 0)
			throw new OodleError(
				`Invalid source size: ${srcOrSize}`,
				"src_size_invalid",
			);
		if (!OodleCompressor[compressor])
			throw new OodleError(
				`Invalid Oodle compressor: ${compressor}`,
				"compressor_invalid",
			);
		return this._GetDecodeBufferSize(compressor, srcOrSize, corruptionPossible);
	}

	private crop(buf: Buffer, size = 0, offset = 0) {
		return buf.subarray(offset, size <= 0 ? buf.length : offset + size);
	}
}

export class OodleError extends Error {
	code: string;

	constructor(message: string, code: string) {
		super(message);
		this.name = "OodleError";
		this.code = code;
	}

	isOodleError() {
		return true;
	}
}
