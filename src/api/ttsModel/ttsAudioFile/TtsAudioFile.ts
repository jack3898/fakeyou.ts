import { implToBase64, implToBuffer, implToDisk, type Audio } from '../../../implementation/index.js';
import { type Client } from '../../../services/client/Client.js';
import { constants } from '../../../util/index.js';
import { type TtsResult } from '../../ttsResult/TtsResult.js';
import type { TtsModel } from '../TtsModel.js';
import { type TtsInferenceStatusDoneSchema } from '../ttsModel.schema.js';

export class TtsAudioFile implements Audio {
	constructor(client: Client, data: TtsInferenceStatusDoneSchema) {
		this.client = client;
		this.resourceUrl = `${constants.GOOGLE_STORAGE_URL}${data.maybe_public_bucket_wav_audio_path}`;
		this.webUrl = `${constants.SITE_URL}/tts/result/${data.job_token}`;

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
	}

	readonly client: Client;
	readonly resourceUrl: string;
	/**
	 * The URL to the page of this audio file in the browser.
	 */
	readonly webUrl: string;

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

	/**
	 * Fetch the TTS model used to generate this audio file.
	 *
	 * @returns The TTS model used to generate this audio file. Undefined if the model could not be fetched.
	 */
	async fetchModel(): Promise<TtsModel | undefined> {
		return this.client.fetchTtsModelByToken(this.modelToken);
	}

	/**
	 * Fetch the audio file as a buffer.
	 */
	toBuffer = implToBuffer;

	/**
	 * Convert the audio file to a base64 string.
	 */
	toBase64 = implToBase64;

	/**
	 * Write the audio file to disk.
	 */
	toDisk = implToDisk;

	/**
	 * Fetch more details about this audio file.
	 */
	fetchFullResult(): Promise<TtsResult | undefined> {
		return this.client.fetchTtsResultByToken(this.resultToken);
	}
}
