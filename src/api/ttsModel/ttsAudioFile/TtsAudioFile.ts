import { type Audio } from '../../../interface/Audio.js';
import { type BaseClass } from '../../../interface/BaseClass.js';
import { AudioFile } from '../../../services/audioFile/AudioFile.js';
import Client from '../../../services/client/Client.js';
import { constants } from '../../../util/index.js';
import type TtsModel from '../TtsModel.js';
import { type TtsInferenceStatusDoneSchema } from '../ttsModel.schema.js';

export default class TtsAudioFile implements Audio, BaseClass {
	constructor(client: Client, data: TtsInferenceStatusDoneSchema) {
		this.client = client;
		this.url = new URL(`${constants.GOOGLE_STORAGE_URL}${data.maybe_public_bucket_wav_audio_path}`);
		this.audioFile = new AudioFile(client, this.url);

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
	readonly audioFile: AudioFile;

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

	/**
	 * Fetch the TTS model used to generate this audio file.
	 *
	 * @returns The TTS model used to generate this audio file. Undefined if the model could not be fetched.
	 */
	async fetchModel(): Promise<TtsModel | undefined> {
		return this.client.fetchTtsModelByToken(this.modelToken);
	}
}
