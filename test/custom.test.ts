import { describe, test, expect } from "vitest";
import { LIB_DIR } from "@/constants";
import Oodle, { OodleError } from "@/oodle";
import path from "path";
import download from "@/downloader";

describe("Oodle custom library path", async () => {
    const input = Buffer.from("hello world".repeat(50));

    await download(false);

    test("can load library from custom path and roundtrip compress/decompress", async () => {
        const customPath = path.join(LIB_DIR, "./bin", process.platform === "win32" ? "oodle.dll" : "oodle.so");
        const oodleCustom = await new Oodle(customPath).init();

        const compressed = oodleCustom.compress(input);
        expect(compressed.length).toBeGreaterThan(0);

        const output = Buffer.allocUnsafe(input.length);
        const result = oodleCustom.decompress(compressed, compressed.length, 0, output, output.length, 0, {});

        expect(result.toString()).toBe(input.toString());
    });

    test("throws error if custom path does not exist", async () => {
        await expect(() => new Oodle("/non/existent/path/oodle.so").init()).rejects.toThrow(OodleError);
    });
});
