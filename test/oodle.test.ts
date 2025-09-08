/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    OodleCompressor,
    OodleCompressionLevel,
} from "@/typings";
import { describe, test, expect, beforeAll } from "vitest";
import Oodle, { OodleError } from "@/oodle";

describe("Oodle Implementation", () => {
    const input = Buffer.from("hello world".repeat(50));
    let oodle: Oodle;

    beforeAll(async () => {
        oodle = new Oodle();
        await oodle.init(); 
    });

    test("library should initialize without errors", () => {
        expect(oodle).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/dot-notation
        expect(oodle["lib"]).toBeDefined();
    });

    describe("minCompressedSize", () => {
        test("returns positive value for valid input", () => {
            const size = oodle.minCompressedSize(1000, OodleCompressor.Kraken);
            expect(size).toBeGreaterThan(0);
        });

        test("throws OodleError for invalid srcSize", () => {
            expect(() => oodle.minCompressedSize(0, OodleCompressor.Kraken)).toThrow(OodleError);
        });

        test("throws OodleError for invalid compressor", () => {
            expect(() => oodle.minCompressedSize(100, 999 as OodleCompressor)).toThrow(OodleError);
        });
    });

    describe("compress", () => {
        test("throws OodleError on empty buffer", () => {
            expect(() => oodle.compress(Buffer.alloc(0))).toThrow(OodleError);
        });

        test("throws OodleError on invalid compressor", () => {
            expect(() => oodle.compress(input, 999 as OodleCompressor)).toThrow(OodleError);
        });

        test("throws OodleError on invalid compression level", () => {
            expect(() => oodle.compress(input, OodleCompressor.Kraken, 999 as OodleCompressionLevel)).toThrow(OodleError);
        });

        test("compress returns trimmed buffer", () => {
            const compressed = oodle.compress(input);
            expect(compressed.length).toBeGreaterThan(0);
            expect(compressed.length).toBeLessThanOrEqual(oodle.minCompressedSize(input.length, OodleCompressor.Kraken));
        });
    });

    describe("decompress", () => {
        let compressed: Buffer;

        beforeAll(() => {
            compressed = oodle.compress(input);
        });

        test("throws OodleError on invalid srcOffset or srcSize", () => {
            const output = Buffer.allocUnsafe(input.length);
            expect(() => oodle.decompress(compressed, -1, 0, output, output.length, 0, {})).toThrow(OodleError);
            expect(() => oodle.decompress(compressed, compressed.length + 10, 0, output, output.length, 0, {})).toThrow(OodleError);
        });

        test("throws OodleError on invalid destOffset or destSize", () => {
            const output = Buffer.allocUnsafe(input.length);
            expect(() => oodle.decompress(compressed, compressed.length, 0, output, 0, 0, {})).toThrow(OodleError);
            expect(() => oodle.decompress(compressed, compressed.length, 0, output, output.length, -1, {})).toThrow(OodleError);
            expect(() => oodle.decompress(compressed, compressed.length, 0, output, output.length, output.length, {})).toThrow(OodleError);
        });

        test("throws OodleError on invalid option values", () => {
            const output = Buffer.allocUnsafe(input.length);
            expect(() => oodle.decompress(compressed, compressed.length, 0, output, output.length, 0, { fuzzSafe: 999 as any })).toThrow(OodleError);
            expect(() => oodle.decompress(compressed, compressed.length, 0, output, output.length, 0, { checkCrc: 999 as any })).toThrow(OodleError);
            expect(() => oodle.decompress(compressed, compressed.length, 0, output, output.length, 0, { verbosity: 999 as any })).toThrow(OodleError);
            expect(() => oodle.decompress(compressed, compressed.length, 0, output, output.length, 0, { decodeThreadPhase: 999 as any })).toThrow(OodleError);
        });

        test("decompress returns original data", () => {
            const output = Buffer.allocUnsafe(input.length);
            const result = oodle.decompress(compressed, compressed.length, 0, output, output.length, 0, {});
            expect(result.toString()).toBe(input.toString());
        });
    });

    test("compress and decompress roundtrip works", () => {
        const compressed = oodle.compress(input);
        const output = Buffer.allocUnsafe(input.length);
        const result = oodle.decompress(compressed, compressed.length, 0, output, output.length, 0, {});
        expect(result.toString()).toBe(input.toString());
    });
});
