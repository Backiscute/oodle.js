/* eslint-disable no-unused-vars */

/**
 * Oodle compression level. Use this to fine tune your speed to compression ratio.
 * 
 * ### Recommended
 * - Use {@link Fast} for testing
 * - Use {@link Optimal} for production
 * - Use {@link Normal} to get a feel for the compression speed of your data to choose a compression level
 * 
 * ### Info
 * Higher numerical value **=** slower and higher compression `(smaller size)`
 * 
 * Smaller numerical value **=** faster and lower compression `(bigger size)`
 * 
 * Compression Level does not affect decode speed, only encode speed.
 * 
 * {@link HyperFast} compression level are only available in {@link OodleCompressor.Kraken}, {@link OodleCompressor.Mermaid} and {@link OodleCompressor.Selkie}
 */
export enum OodleCompressionLevel {
    /**
     * No compression, copies the raw bytes.
     */
    None = 0,
    /**
     * Fastest but most minimal compression.
     * 
     * Faster than {@link HyperFast3}
     * 
     * Same as {@link HyperFast4}
     */
    Min,
    /**
     * Fastest but most minimal compression.
     * 
     * Faster than {@link HyperFast3}
     * 
     * Same as {@link HyperFast4}
     */
    Fastest,
    /**
     * Fastest but most minimal compression.
     * 
     * Faster than {@link HyperFast3}
     */
    HyperFast4 = -4,
    /**
     * Extremely fast but very minimal compression.
     * 
     * Faster than {@link HyperFast2}
     */
    HyperFast3 = -3,
    /**
     * Hyper fast but minimal compression.
     * 
     * Faster than {@link HyperFast} and {@link HyperFast1}
     */
    HyperFast2 = -2,
    /**
     * Hyper fast but extremely low compression.
     * 
     * Faster than {@link SuperFast}
     * 
     * Same as {@link HyperFast1}
     */
    HyperFast,
    HyperFast1 = -1,
    /**
     * Super fast but very low compression.
     * 
     * Faster than {@link VeryFast}
     */
    SuperFast = 1,
    /**
     * Very fast but low compression.
     * 
     * Faster than {@link Fast}
     */
    VeryFast = 2,
    /**
     * Fast and decent compression.
     * 
     * Recommended for daily use by [Epic Games](https://dev.epicgames.com/documentation/en-us/unreal-engine/oodle-data).
     * 
     * Faster than {@link Normal}
     */
    Fast = 3,
    /**
     * Decent speed and medium compression.
     */
    Normal = 4,
    /**
     * Fast optimal encoding.
     * 
     * Slower than {@link Optimal} and {@link Optimal2}
     */
    Optimal1 = 5,
    /**
     * Optimal encoding.
     * 
     * Recommended baseline optimal encoder by [Epic Games](https://dev.epicgames.com/documentation/en-us/unreal-engine/oodle-data).
     * 
     * Same as {@link Optimal2}
     */
    Optimal,
    /**
     * Optimal encoding.
     * 
     * Recommended baseline optimal encoder by [Epic Games](https://dev.epicgames.com/documentation/en-us/unreal-engine/oodle-data).
     */
    Optimal2 = 6,
    /**
     * Slower optimal encoding.
     * 
     * Slower than {@link Optimal} and {@link Optimal2}
     */
    Optimal3 = 7,
    /**
     * Very slow optimal encoding.
     * 
     * Slower than {@link Optimal3}
     */
    Optimal4 = 8,
    /**
     * Slowest encoding but maximum compression.
     * 
     * Slower than {@link Optimal4}
     * 
     * Same as {@link Optimal5}
     */
    Max,
    /**
     * Slowest encoding but maximum compression.
     * 
     * Slower than {@link Optimal4}
     * 
     * Same as {@link Optimal5}
     */
    Slowest,
    /**
     * Slowest encoding but maximum compression.
     * 
     * Slower than {@link Optimal4}
     */
    Optimal5 = 9,
}

/**
 * The compression algorithm used by Oodle.
 * 
 * ### Recommended
 * - {@link Kraken} for normal use.
 * - {@link Mermaid} when CPU power is limited.
 */
export enum OodleCompressor {
    /**
     * No compression, copies the raw bytes.
     */
    None = 3,
    /**
     * @deprecated as of Oodle `2.9.0`. Only use with your own provided **older** Oodle lib.
     */
    LZH = 0,
    /**
     * @deprecated as of Oodle `2.9.0`. Only use with your own provided **older** Oodle lib.
     */
    LZHLW = 1,
    /**
     * @deprecated as of Oodle `2.9.0`. Only use with your own provided **older** Oodle lib.
     */
    LZNIB = 2,
    /**
     * @deprecated as of Oodle `2.9.0`. Only use with your own provided **older** Oodle lib.
     */
    LZB16 = 4,
    /**
     * @deprecated as of Oodle `2.9.0`. Only use with your own provided **older** Oodle lib.
     */
    LZBLW = 5,
    /**
     * @deprecated as of Oodle `2.9.0`. Only use with your own provided **older** Oodle lib.
     */
    LZA = 6,
    /**
     * @deprecated as of Oodle `2.9.0`. Only use with your own provided **older** Oodle lib.
     */
    LZNA = 7,
    /**
     * High compression with good decode speed.
     * 
     * Recommended to use as your default option.
     */
    Kraken = 8,
    /**
     * Less compression and faster decode speed.
     * 
     * Recommended to use when CPU power is limited.
     * 
     * Faster than {@link Kraken}
     */
    Mermaid = 9,
    /**
     * @deprecated as of Oodle `2.9.0`. Only use with your own provided **older** Oodle lib.
     */
    Bitknit = 10,
    /**
     * Least compression and fastest decode speed.
     * 
     * Fast than {@link Mermaid}
     */
    Selkie = 11,
    /**
     * A meta compressor that uses {@link Kraken}, {@link Mermaid}, {@link Selkie} and {@link Leviathan} under the hood.
     * 
     * It automatically chooses one of those compressors to encode each block. This results in a mix of each compressor in the final result, giving a better average speed to compression ratio.
     */
    Hydra = 12,
    /**
     * Most compression but slower decode speed.
     * 
     * Slower than {@link Kraken}
     */
    Leviathan = 13,
}

/**
 * Log level used by Oodle used to determine what info to log.
 * 
 * @deprecated Unused by the new compressors. Only use with your own provided **older** Oodle lib.
 */
export enum OodleVerbosity {
    None = 0,
    Min = 1,
    Some = 2,
    Max = 3,
}

/**
 * Enable extra safety checks
 * 
 * Recommended to use {@link Yes}
 */
export enum OodleFuzzSafe {
    No = 0,
    Yes = 1,
}

/**
 * Check CRC for errors
 * 
 * Recommended to use {@link Yes}
 */
export enum OodleCheckCRC {
    No = 0,
    Yes = 1,
}

export enum OodleDecodeThreadPhase {
    Phase1 = 1,
    Phase2 = 2,
    All,
    Unthreaded = 3,
}

export interface OodleLib {
    decompress(
        src_buf: Buffer,
        src_len: number,
        dst: Buffer,
        dst_size: number,
        fuzz: OodleFuzzSafe,
        crc: OodleCheckCRC,
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        verbose: OodleVerbosity,
        dst_base: null,
        e: 0,
        cb: null,
        cb_ctx: null,
        scratch: null,
        scratch_size: 0,
        threadPhase: OodleDecodeThreadPhase,
    ): number;

    compress(
        codec: number,
        src_buf: Buffer,
        src_len: number,
        dst_buf: Buffer,
        level: OodleCompressionLevel,
        opts: null,
        offs: null,
        unused: null,
        scratch: null,
        scratch_size: 0,
    ): number;

    maxCompressedSize(src_len: number, level: OodleCompressionLevel): number;
}
