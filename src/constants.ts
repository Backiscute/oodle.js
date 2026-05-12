import { fileURLToPath } from "node:url";
import path from "node:path";

export const LIB_DIR = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	"../",
);
export const OODLE_DIR = path.join(LIB_DIR, "bin");
export const OODLE_PATH = path.join(
	OODLE_DIR,
	`oodle-${process.arch}.${
		process.platform === "win32"
			? "dll"
			: process.platform === "darwin"
				? "a"
				: "so"
	}`,
);
export const REPO_URL =
	"https://api.github.com/repos/workingrobot/oodleue/releases/latest";
export const WINDOWS_ARCHIVE = "msvc";
export const UNIX_ARCHIVE = "gcc";
export const LIB_PATH =
	process.platform === "win32"
		? "bin/oodle-data-shared.dll"
		: process.platform === "darwin"
			? "ar/liboodle-data-static.a"
			: "lib/liboodle-data-shared.so";
