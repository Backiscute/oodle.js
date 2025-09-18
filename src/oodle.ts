import {
    OodleCheckCRC,
    OodleCompressionLevel,
    OodleCompressor,
    OodleDecodeThreadPhase,
    OodleFuzzSafe,
    OodleLib,
    OodleVerbosity,
} from "./typings";
import { OODLE_PATH } from "./constants";
import koffi from "koffi";
import download from "./downloader";
import p from "path";

export default class Oodle {
    private lib?: koffi.IKoffiLib;
    // @internal
    public nativeDecompress?: OodleLib["decompress"];
    // @internal
    public nativeCompress?: OodleLib["compress"];
    // @internal
    public nativeMaxCompressedSize?: OodleLib["maxCompressedSize"];
    private pathOrClearCache: string | boolean;

    constructor(pathOrClearCache?: string | boolean) {
        this.pathOrClearCache = pathOrClearCache ?? false;
    }

    async init() {
        let path: string;
        if (typeof this.pathOrClearCache === "string") {
            if (!p.isAbsolute(this.pathOrClearCache)) throw new OodleError("Oodle path must be absolute", "path_not_absolute");
            path = this.pathOrClearCache;
        }
        else {
            path = OODLE_PATH;
            await download(this.pathOrClearCache);
        }

        try {
            const lib = koffi.load(path);
            this.lib = lib;
            this.nativeDecompress = lib.func("OodleLZ_Decompress", "int", [
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
            ]) as OodleLib["decompress"];
            this.nativeCompress = lib.func("OodleLZ_Compress", "int", [
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
            ]) as OodleLib["compress"];
            this.nativeMaxCompressedSize = lib.func(
                "OodleLZ_GetCompressedBufferSizeNeeded",
                "int",
                ["int", "int"],
            ) as OodleLib["maxCompressedSize"];
            
            return this;
        } catch (error) {
            this.lib = undefined;
            this.nativeDecompress = undefined;
            this.nativeCompress = undefined;
            this.nativeMaxCompressedSize = undefined;
            throw new OodleError(
                `Oodle library initialization failed: ${error}`,
                "lib_init_failed",
            );
        }
    }

    decompress(
        src: Buffer,
        srcSize: number,
        srcOffset: number,
        dest: Buffer,
        destSize: number,
        destOffset: number,
        {
            fuzzSafe = OodleFuzzSafe.Yes,
            checkCRC = OodleCheckCRC.No,
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            verbosity = OodleVerbosity.None,
            decodeThreadPhase = OodleDecodeThreadPhase.Unthreaded,
        },
    ) {
        if (!this.lib || !this.nativeDecompress)
            throw new OodleError(
                "Oodle library not initialized",
                "lib_not_initialized",
            );
        if (srcOffset < 0 || srcOffset + srcSize > src.length)
            throw new OodleError(
                `Invalid source buffer range: offset ${srcOffset}, size ${srcSize}, buffer length ${src.length}`,
                "src_range_invalid",
            );
        if (destOffset < 0 || destOffset + destSize > dest.length)
            throw new OodleError(
                `Invalid destination buffer range: offset ${destOffset}, size ${destSize}, buffer length ${dest.length}`,
                "dest_range_invalid",
            );
        if (srcSize <= 0)
            throw new OodleError(
                `Invalid source size: ${srcSize}`,
                "src_size_invalid",
            );
        if (destSize < srcSize)
            throw new OodleError(
                `Destination size ${destSize} is smaller than source size ${srcSize}`,
                "dest_size_invalid",
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
        // eslint-disable-next-line @typescript-eslint/no-deprecated
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

        const buf = dest.subarray(destOffset, destOffset + destSize);
        const size = this.nativeDecompress(
            src.subarray(srcOffset, srcOffset + srcSize),
            srcSize,
            buf,
            destSize,
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

        if (size <= 0)
            throw new OodleError(
                `Oodle decompression failed: Invalid decompressed size ${size}`,
                "decompress_size_invalid",
            );

        return buf;
    }

    compress(
        src: Buffer,
        compressor: OodleCompressor = OodleCompressor.Kraken,
        level: OodleCompressionLevel = OodleCompressionLevel.Optimal,
    ) {
        if (!this.lib || !this.nativeCompress)
            throw new OodleError(
                "Oodle library not initialized",
                "lib_not_initialized",
            );
        if (src.length <= 0)
            throw new OodleError(
                `Invalid source size: ${src.length}`,
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

        const buf = Buffer.allocUnsafe(
            this.maxCompressedSize(src.length, compressor),
        );
        const size = this.nativeCompress(
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
        if (size <= 0)
            throw new OodleError(
                `Oodle compression failed: Invalid compressed size ${size}`,
                "compress_size_invalid",
            );

        return buf.subarray(0, size);
    }

    maxCompressedSize(srcSize: number, compressor: OodleCompressor) {
        if (!this.lib || !this.nativeMaxCompressedSize)
            throw new OodleError(
                "Oodle library not initialized",
                "lib_not_initialized",
            );
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
        return this.nativeMaxCompressedSize(compressor, srcSize);
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
