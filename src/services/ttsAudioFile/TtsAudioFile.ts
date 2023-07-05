import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import type { AudioFile } from '../../interface/AudioFile.js';
import { download, constants } from '../../util/index.js';
import TtsModel from '../ttsModel/TtsModel.js';
import { type TtsInferenceStatusDoneSchema } from '../ttsModel/ttsModel.schema.js';

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

	async toBuffer(): Promise<Buffer | null> {
		if (this.#buffer) {
			return this.#buffer;
		}

		const wav = await download.wav(this.url);

		if (wav) {
			this.#buffer = wav;

			return this.#buffer;
		}

		return null;
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

	async fetchModel(): Promise<TtsModel | null> {
		return TtsModel.fetchModelByToken(this.modelToken);
	}
}