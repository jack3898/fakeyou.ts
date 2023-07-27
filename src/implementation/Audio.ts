import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { type BaseClass } from '../interface/BaseClass.js';

const writeFile = promisify(fs.writeFile);

/**
 * An implementation to fetch audio related data.
 */
export interface Audio extends BaseClass {
	/**
	 * The external URL to the audio file. Expects a WAV file.
	 */
	resourceUrl: string;

	/**
	 * A place to store the buffer of the audio file.
	 */
	buffer?: Buffer;

	toBuffer(): Promise<Buffer | undefined>;

	toBase64(): Promise<string | undefined>;

	toDisk(location: `${string}.wav`): Promise<void>;
}

/**
 * Fetch a buffer of the audio file using the {@link Audio.resourceUrl}.
 *
 * The format of the audio file is WAV.
 *
 * @param this The class that implements this {@link Audio} interface.
 * @returns A buffer of the audio file.
 */
export async function implToBuffer(this: Audio): Promise<Buffer | undefined> {
	if (this.buffer) {
		return this.buffer;
	}

	const wav = await this.client.rest.download(this.resourceUrl, 'audio/wav');

	this.buffer = wav;

	return this.buffer;
}

/**
 * Convert the audio file to a base64 string.
 * Useful for when you want to send the audio file in a format restricted HTTP request.
 *
 * The format of the audio file is WAV.
 *
 * @param this The class that implements this {@link Audio} interface.
 * @returns A base64 string of the audio file.
 */
export async function implToBase64(this: Audio): Promise<string | undefined> {
	const buffer = await this.toBuffer();

	return buffer && Buffer.from(buffer).toString('base64');
}

/**
 * Write the audio file locally to disk.
 *
 * The format of the audio file is WAV.
 *
 * @param this The class that implements this {@link Audio} interface.
 * @param location The location to write the audio file to. Relative to the current working file.
 */
export async function implToDisk(this: Audio, location: `${string}.wav`): Promise<void> {
	const buffer = await this.toBuffer();

	if (buffer) {
		return writeFile(path.resolve(location), buffer);
	}
}
