import type Client from '../../index.js';
import { PollStatus, cache, constants, poll, log, prettyParse } from '../../util/index.js';
import V2vAudioFile from '../v2vAudioFile/V2vAudioFile.js';
import {
	type V2vModelSchema,
	v2vModelListSchema,
	v2vVoiceUploadResponseSchema,
	v2vInferenceResultSchema,
	v2vRequestStatusResponseSchema,
	type V2vInferenceStatusDoneSchema,
	type V2vInferenceSchema,
	type V2vVoiceUploadResponseSchema
} from './v2vModel.schema.js';

export default class V2vModel {
	constructor(data: V2vModelSchema) {
		this.token = data.token;
		this.modelType = data.model_type;
		this.title = data.title;
		this.creatorUserToken = data.creator.user_token;
		this.creatorUsername = data.creator.username;
		this.creatorDisplayName = data.creator.display_name;
		this.creatorGravatarHash = data.creator.gravatar_hash;
		this.creatorSetVisibility = data.creator_set_visibility;
		this.ietfLanguageTag = data.ietf_language_tag;
		this.ietfPrimaryLanguageSubtag = data.ietf_primary_language_subtag;
		this.isFrontPageFeatured = data.is_front_page_featured;
		this.createdAt = data.created_at;
		this.updatedAt = data.updated_at;
	}

	readonly token: string;
	readonly modelType: string;
	readonly title: string;
	readonly creatorUserToken: string;
	readonly creatorUsername: string;
	readonly creatorDisplayName: string;
	readonly creatorGravatarHash: string;
	readonly creatorSetVisibility: 'public' | 'hidden';
	readonly ietfLanguageTag: string;
	readonly ietfPrimaryLanguageSubtag: string;
	readonly isFrontPageFeatured: boolean;
	readonly createdAt: Date;
	readonly updatedAt: Date;

	static client: Client;

	static fetchModels(): Promise<Map<string, V2vModel>> {
		return cache.wrap('fetch-v2v-models', async () => {
			const response = await this.client.rest.send(new URL(`${constants.API_URL}/v1/voice_conversion/model_list`));
			const json = prettyParse(v2vModelListSchema, await response.json());

			const map = new Map<string, V2vModel>();

			for (const modelData of json.models) {
				map.set(modelData.token, new this(modelData));
			}

			return map;
		});
	}

	/**
	 * This is the fastest method to find the model you need, the token is unique to each model and
	 * can be found in the URL of the model's more details page on fakeyou.com.
	 */
	static async fetchModelByToken(token: string): Promise<V2vModel | undefined> {
		const models = await this.fetchModels();

		return models.get(token);
	}

	static async #uploadAudio(file: Buffer): Promise<V2vVoiceUploadResponseSchema | undefined> {
		try {
			const response = await this.client.rest.upload(
				new URL(`${constants.API_URL}/v1/media_uploads/upload_audio`),
				file,
				'audio/wav'
			);

			return prettyParse(v2vVoiceUploadResponseSchema, await response.json());
		} catch (error) {
			log.error(
				`Unexpected response from the server. Maybe you uploaded the wrong file type (not a wav) or there was an unknown error.\n${error}`
			);
		}
	}

	async #fetchInference(uploadToken: string): Promise<V2vInferenceSchema | undefined> {
		const response = await V2vModel.client.rest.send(new URL(`${constants.API_URL}/v1/voice_conversion/inference`), {
			method: 'POST',
			body: JSON.stringify({
				uuid_idempotency_token: crypto.randomUUID(),
				voice_conversion_model_token: this.token,
				source_media_upload_token: uploadToken
			})
		});

		const inference = prettyParse(v2vInferenceResultSchema, await response.json());

		if (!inference.success) {
			log.error(`There was a problem fetching this inference. Reason: ${inference.error_reason}.`);

			return;
		}

		return inference;
	}

	#getAudioUrl(inferenceJobToken: string): Promise<V2vInferenceStatusDoneSchema | undefined> {
		return poll(async () => {
			const response = await V2vModel.client.rest.send(
				new URL(`${constants.API_URL}/v1/model_inference/job_status/${inferenceJobToken}`)
			);
			const result = prettyParse(v2vRequestStatusResponseSchema, await response.json());

			switch (result.state.status.status) {
				case 'pending':
					return PollStatus.Retry;
				case 'started':
					return PollStatus.Retry;
				case 'complete_success':
					return result.state as V2vInferenceStatusDoneSchema;
				case 'attempt_failed':
					return PollStatus.Retry;
				case 'complete_failure':
					return PollStatus.Abort;
				case 'dead':
					return PollStatus.Abort;
				default:
					return PollStatus.Abort;
			}
		});
	}

	/**
	 * Infer text for this model!
	 *
	 * Unlike TTS, this does NOT support rate limit safety features, so be cautious!
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async infer(audio: Buffer): Promise<V2vAudioFile | undefined> {
		const uploadedAudio = await V2vModel.#uploadAudio(audio);

		if (!uploadedAudio) {
			return;
		}

		const inference = await this.#fetchInference(uploadedAudio.upload_token);

		if (!inference) {
			return;
		}

		const audioUrl = await this.#getAudioUrl(inference.inference_job_token);

		if (audioUrl) {
			return new V2vAudioFile(audioUrl);
		}
	}
}
