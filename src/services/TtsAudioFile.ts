import { promisify } from 'node:util';
import { googleStorageUrl } from '../util/constants.js';
import type { TtsInferenceStatusDoneSchema } from '../util/validation.js';
import fs from 'node:fs';
import path from 'node:path';

const writeFile = promisify(fs.writeFile);

export default class TtsAudioFile {
	constructor(data: TtsInferenceStatusDoneSchema) {
		this.token = data.job_token;
		this.status = data.status;
		this.extraStatusDescription = data.maybe_extra_status_description;
		this.attemptCount = data.attempt_count;
		this.resultToken = data.maybe_result_token;
		this.publicBucketWavAudioPath = data.maybe_public_bucket_wav_audio_path;
		this.modelToken = data.model_token;
		this.ttsModelType = data.tts_model_type;
		this.title = data.title;
		this.rawInferenceText = data.raw_inference_text;
		this.createdAt = data.created_at;
		this.updatedAt = data.updated_at;
		this.url = new URL(`${googleStorageUrl}${data.maybe_public_bucket_wav_audio_path}`);
	}

	#buffer?: Buffer;

	readonly token: string;

	readonly status: string;

	readonly extraStatusDescription: string | null;

	readonly attemptCount: number;

	readonly resultToken: string;

	readonly publicBucketWavAudioPath: string;

	readonly modelToken: string;

	readonly ttsModelType: string;

	readonly title: string;

	readonly rawInferenceText: string;

	readonly createdAt: Date;

	readonly updatedAt: Date;

	readonly url: URL;

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
