import zip from "node-stream-zip";
import fs from "node:fs";
import path from "node:path";
import {
	OODLE_DIR,
	OODLE_PATH,
	REPO_URL,
	UNIX_ARCHIVE,
	WINDOWS_ARCHIVE,
	LIB_PATH,
} from "./constants";
import { OodleError } from "./oodle";

export default async function download(clearCache = false) {
	try {
		if (fs.existsSync(OODLE_PATH)) return;
		if (clearCache) fs.rmSync(OODLE_DIR, { recursive: true });
		if (!fs.existsSync(OODLE_DIR)) fs.mkdirSync(OODLE_DIR);

		const latestRelease = await fetch(REPO_URL).then(
			async (res) =>
				(await res.json()) as {
					assets: { name: string; browser_download_url: string }[];
				},
		);

		const archiveName = `${process.platform === "win32" ? WINDOWS_ARCHIVE : UNIX_ARCHIVE}-${process.arch}-release.zip`;
		const archiveURL = latestRelease.assets.find(
			(asset) => asset.name === archiveName,
		)?.browser_download_url;

		if (!archiveURL)
			throw new OodleError(
				`Oodle downloader failed: Couldn't find library download url for ${archiveName}-${process.arch}`,
				"lib_download_url_notfound",
			);

		const archivePath = path.join(OODLE_DIR, "temp.zip");
		fs.writeFileSync(
			archivePath,
			await fetch(archiveURL).then(async (res) => await res.bytes()),
		);

		const archive = new zip.async({
			file: archivePath,
		});

		try {
			const lib = await archive.entryData(LIB_PATH);

			fs.writeFileSync(OODLE_PATH, lib);
		} catch {
			throw new OodleError(
				"Oodle downloader failed: Couldn't find library in archive",
				"lib_notfound",
			);
		} finally {
			await archive.close();
			fs.rmSync(archivePath);
		}
	} catch (error) {
		if (error instanceof OodleError) throw error;
		throw new OodleError(
			`Oodle downloader failed: ${error}`,
			"lib_download_failed",
		);
	}
}
