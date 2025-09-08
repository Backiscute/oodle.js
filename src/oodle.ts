import {
    OodleCheckCrc,
    OodleCompressionLevel,
    OodleCompressor,
    OodleDecodeThreadPhase,
    OodleFuzzSafe,
    OodleLib,
    OodleVerbosity,
} from "@/typings";
import { OODLE_PATH } from "./constants";
import koffi from "koffi";
import download from "./downloader";

export default class Oodle {
    private lib?: koffi.IKoffiLib;
    private oodleDecompress?: OodleLib["decompress"];
    private oodleCompress?: OodleLib["compress"];
    private oodleGetMinCompressedSize?: OodleLib["getMinCompressedSize"];
    private pathOrClearCache: string | boolean;

    constructor(pathOrClearCache?: string | boolean) {
        this.pathOrClearCache = pathOrClearCache ?? false;
    }

    async init() {
        let path: string;
        if (typeof this.pathOrClearCache === "string") path = this.pathOrClearCache;
        else {
            path = OODLE_PATH;
            await download(this.pathOrClearCache);
        }

        try {
            const lib = koffi.load(path);
            this.lib = lib;
            this.oodleDecompress = lib.func("OodleLZ_Decompress", "int", [
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
            this.oodleCompress = lib.func("OodleLZ_Compress", "int", [
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
            this.oodleGetMinCompressedSize = lib.func(
                "OodleLZ_GetCompressedBufferSizeNeeded",
                "int",
                ["int", "int"],
            ) as OodleLib["getMinCompressedSize"];
            
            return this;
        } catch (error) {
            this.lib = undefined;
            this.oodleDecompress = undefined;
            this.oodleCompress = undefined;
            this.oodleGetMinCompressedSize = undefined;
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
            checkCrc = OodleCheckCrc.No,
            verbosity = OodleVerbosity.None,
            decodeThreadPhase = OodleDecodeThreadPhase.Unthreaded,
        },
    ) {
        if (!this.lib || !this.oodleDecompress)
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
        if (!OodleCheckCrc[checkCrc])
            throw new OodleError(
                `Invalid Oodle check CRC option: ${checkCrc}`,
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

        const buf = dest.subarray(destOffset, destOffset + destSize);
        const size = this.oodleDecompress(
            src.subarray(srcOffset, srcOffset + srcSize),
            srcSize,
            buf,
            destSize,
            fuzzSafe,
            checkCrc,
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
        if (!this.lib || !this.oodleCompress)
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
            this.minCompressedSize(src.length, compressor),
        );
        const size = this.oodleCompress(
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

    minCompressedSize(srcSize: number, compressor: OodleCompressor) {
        if (!this.lib || !this.oodleGetMinCompressedSize)
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
        return this.oodleGetMinCompressedSize(compressor, srcSize);
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
