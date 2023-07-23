import fs from 'node:fs';
import { promisify } from 'node:util';
import path from 'path';
import { type BaseClass } from '../../interface/BaseClass.js';
import Client from '../client/Client.js';

const writeFile = promisify(fs.writeFile);

export class AudioFile implements BaseClass {
	constructor(client: Client, url: URL) {
		this.client = client;
		this.resourceUrl = url;
	}

	readonly client: Client;
	readonly resourceUrl: URL;

	#buffer?: Buffer;

	/**
	 * Convert the audio file to a buffer.
	 *
	 * @returns The buffer.
	 */
	async toBuffer(): Promise<Buffer | undefined> {
		if (this.#buffer) {
			return this.#buffer;
		}

		const wav = await this.client.rest.download(this.resourceUrl, 'audio/wav');

		this.#buffer = wav;

		return this.#buffer;
	}

	/**
	 * Convert the audio file to a base64 string.
	 *
	 * @returns The base64 string.
	 */
	async toBase64(): Promise<string | undefined> {
		const buffer = await this.toBuffer();

		return buffer && Buffer.from(buffer).toString('base64');
	}

	/**
	 * Write the audio file to disk.
	 *
	 * @param location The location to write the file to (including the file type)
	 * @returns A promise that resolves when the file has been written.
	 * @rejects If the file could not be written.
	 */
	async toDisk(location: `${string}.wav`): Promise<void> {
		const buffer = await this.toBuffer();

		if (buffer) {
			return writeFile(path.resolve(location), buffer);
		}
	}
}
