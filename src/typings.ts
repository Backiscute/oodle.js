/* eslint-disable no-unused-vars */

//TODO: Add jsdoc from https://github.com/NotOfficer/Oodle.NET/blob/master/src/Oodle.NET/Enums.cs
//TODO: Get docs generator from djs i think

export enum OodleCompressionLevel {
    None = 0,
    SuperFast = 1,
    VeryFast = 2,
    Fast = 3,
    Normal = 4,
    Optimal1 = 5,
    Optimal,
    Optimal2 = 6,
    Optimal3 = 7,
    Optimal4 = 8,
    Max,
    Optimal5 = 9,
    HyperFast1 = -1,
    HyperFast2 = -2,
    HyperFast3 = -3,
    Min,
    HyperFast4 = -4,
}

export enum OodleCompressor {
    LZH = 0,
    LZHLW = 1,
    LZNIB = 2,
    None = 3,
    LZB16 = 4,
    LZBLW = 5,
    LZA = 6,
    LZNA = 7,
    Kraken = 8,
    Mermaid = 9,
    Bitknit = 10,
    Selkie = 11,
    Hydra = 12,
    Leviathan = 13,
}

export enum OodleVerbosity {
    None = 0,
    Min = 1,
    Some = 2,
    Max = 3,
}

export enum OodleFuzzSafe {
    No = 0,
    Yes = 1,
}

export enum OodleCheckCrc {
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
        crc: OodleCheckCrc,
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

    getMinCompressedSize(src_len: number, level: OodleCompressionLevel): number;
}
