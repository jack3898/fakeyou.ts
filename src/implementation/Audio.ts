import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { type BaseClass } from '../interface/BaseClass.js';

const writeFile = promisify(fs.writeFile);

export interface Audio extends BaseClass {
	resourceUrl: string;

	buffer?: Buffer;

	toBuffer(): Promise<Buffer | undefined>;

	toBase64(): Promise<string | undefined>;

	toDisk(location: `${string}.wav`): Promise<void>;
}

/**
 * Implement the {@link Audio} interface and bind this function to the given class.
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
 * Implement the {@link Audio} interface and bind this function to the given class.
 */
export async function implToBase64(this: Audio): Promise<string | undefined> {
	const buffer = await this.toBuffer();

	return buffer && Buffer.from(buffer).toString('base64');
}

/**
 * Implement the {@link Audio} interface and bind this function to the given class.
 */
export async function implToDisk(this: Audio, location: `${string}.wav`): Promise<void> {
	const buffer = await this.toBuffer();

	if (buffer) {
		return writeFile(path.resolve(location), buffer);
	}
}
