import { OodleError } from "@/oodle";
import { describe, test, expect } from "vitest";

describe("Oodle Error", () => {
    test("does contain message and code", () => {
        const error = new OodleError("test error", "test_error");

        expect(error.message).toBe("test error");
        expect(error.code).toBe("test_error");
    });

    test("isOodleError returns true", () => {
        const error = new OodleError("test error", "test_error");

        expect(error.isOodleError()).toBe(true);
    });

    test("does extend Error", () => {
        expect(new OodleError("test error", "test_error")).toBeInstanceOf(Error);
    });
});