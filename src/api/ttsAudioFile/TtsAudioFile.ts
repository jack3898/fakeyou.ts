import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import type { AudioFile } from '../../interface/AudioFile.js';
import { constants } from '../../util/index.js';
import TtsModel from '../ttsModel/TtsModel.js';
import { type TtsInferenceStatusDoneSchema } from '../ttsModel/ttsModel.schema.js';
import type Client from '../../index.js';

const writeFile = promisify(fs.writeFile);

export default class TtsAudioFile implements AudioFile {
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
		this.url = new URL(`${constants.GOOGLE_STORAGE_URL}${data.maybe_public_bucket_wav_audio_path}`);
	}

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

	#buffer?: Buffer;

	static client: Client;

	/**
	 * The buffer of the audio file.
	 *
	 * @returns The buffer. Undefined if the audio file has not been fetched yet.
	 */
	async toBuffer(): Promise<Buffer | undefined> {
		if (this.#buffer) {
			return this.#buffer;
		}

		const wav = await TtsAudioFile.client.rest.download(this.url, 'audio/wav');

		if (wav) {
			this.#buffer = wav;

			return this.#buffer;
		}
	}

	/**
	 * The base64 string of the audio file.
	 *
	 * @returns The base64 string
	 */
	async toBase64(): Promise<string | undefined> {
		const buffer = await this.toBuffer();

		return buffer && Buffer.from(buffer).toString('base64');
	}

	/**
	 * Write the audio file to disk.
	 *
	 * @param location The location to write the file to (must be a wav)
	 * @returns A promise that resolves when the file has been written
	 */
	async toDisk(location: `${string}.wav`): Promise<void> {
		const buffer = await this.toBuffer();

		if (buffer) {
			return writeFile(path.resolve(location), buffer);
		}
	}

	/**
	 * Fetch the TTS model used to generate this audio file.
	 *
	 * @returns The TTS model used to generate this audio file
	 */
	async fetchModel(): Promise<TtsModel | undefined> {
		return TtsModel.fetchModelByToken(this.modelToken);
	}
}
