import fs from "fs";
import uzip from "uzip";
import path from "path";
import { OODLE_DIR, OODLE_PATH, REPO_URL, UNIX_ARCHIVE, UNIX_LIB_PATH, WINDOWS_ARCHIVE, WINDOWS_LIB_PATH } from "./constants";
import { OodleError } from "./oodle";

export default async function download(clearCache = false) {
    try {
        if (fs.existsSync(OODLE_PATH)) return;
        if (clearCache) fs.rmSync(OODLE_DIR, { recursive: true });
        if (!fs.existsSync(OODLE_DIR)) fs.mkdirSync(OODLE_DIR);

        const latestRelease = await fetch(REPO_URL).then(async (res) => await res.json() as { assets: { name: string; browser_download_url: string }[] });
        const archiveName = process.platform === "win32" ? WINDOWS_ARCHIVE : UNIX_ARCHIVE;
        const archiveURL = latestRelease.assets.find((asset) => asset.name === archiveName)?.browser_download_url;

        if (!archiveURL) throw new OodleError("Oodle downloader failed: Couldn't find library download url", "lib_download_url_notfound");

        const archive = await fetch(archiveURL).then(async (res) => await res.arrayBuffer());
        const libPath = process.platform === "win32" ? WINDOWS_LIB_PATH : UNIX_LIB_PATH;
        const lib = uzip.parse(archive)[libPath];

        if (!lib) throw new OodleError("Oodle downloader failed: Couldn't find library in archive", "lib_notfound");

        fs.writeFileSync(path.join(OODLE_PATH), lib);
    } catch (error) {
        throw new OodleError(`Oodle downloader failed: ${error}`, "lib_download_failed");
    }
}