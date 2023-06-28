import { promisify } from 'node:util';
import { googleStorageUrl } from '../util/constants.js';
import type { TtsRequestStatusDoneResponse } from '../util/validation.js';
import fs from 'node:fs';
import path from 'node:path';

const writeFile = promisify(fs.writeFile);

export default class TtsAudioFile {
	readonly data: TtsRequestStatusDoneResponse;
	readonly url: URL;
	#buffer?: Buffer;

	constructor(data: TtsRequestStatusDoneResponse) {
		this.data = data;
		this.url = new URL(`${googleStorageUrl}${this.data.maybe_public_bucket_wav_audio_path}`);
	}

	async toBuffer(): Promise<Buffer | null> {
		if (this.#buffer) {
			return this.#buffer;
		}

		const headers = new Headers();

		headers.append('content-type', 'audio/x-wav');

		const result = await fetch(this.url, {
			method: 'GET',
			headers
		});

		if (result.type === 'opaque') {
			return null;
		}

		const arrayBuffer = await result.blob().then((b) => b?.arrayBuffer());

		this.#buffer = Buffer.from(arrayBuffer);

		return this.#buffer;
	}

	async toBase64(): Promise<string | null> {
		const buffer = await this.toBuffer();

		return buffer ? Buffer.from(buffer).toString('base64') : null;
	}

	async toDisk(location: `${string}.wav`): Promise<void> {
		const buffer = await this.toBuffer();

		if (buffer) {
			return writeFile(path.resolve(location), buffer);
		}
	}
}
