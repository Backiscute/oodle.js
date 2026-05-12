import { fileURLToPath } from "url";
import path from "path";

export const LIB_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "../");
export const OODLE_DIR = path.join(LIB_DIR, "bin");
export const OODLE_PATH = path.join(OODLE_DIR, process.platform === "win32" ? "oodle.dll" : process.platform === "darwin" ? "oodle.a" : "oodle.so");
export const REPO_URL = "https://api.github.com/repos/workingrobot/oodleue/releases/latest";
export const WINDOWS_ARCHIVE = "msvc";
export const UNIX_ARCHIVE = "gcc";
export const WINDOWS_LIB_PATH = "bin/oodle-data-shared.dll";
export const LINUX_LIB_PATH = "lib/liboodle-data-shared.so";
export const DARWIN_LIB_PATH = "ar/liboodle-data-static.a";