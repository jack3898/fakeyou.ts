import { implFetchUser, type User } from '../../implementation/index.js';
import Client from '../../index.js';
import { constants, log, poll, PollStatus, prettyParse } from '../../util/index.js';
import { V2vAudioFile } from './v2vAudioFile/V2vAudioFile.js';
import {
	v2vInferenceResultSchema,
	v2vRequestStatusResponseSchema,
	v2vVoiceUploadResponseSchema,
	type V2vInferenceSchema,
	type V2vInferenceStatusDoneSchema,
	type V2vModelSchema,
	type V2vVoiceUploadResponseSchema
} from './v2vModel.schema.js';

/**
 * A voice conversion model.
 * This is a model that can be used to convert audio from one voice to another.
 */
export class V2vModel implements User {
	/**
	 * @param client The main client.
	 * @param data The raw model data from the FakeYou API.
	 */
	constructor(client: Client, data: V2vModelSchema) {
		this.client = client;

		this.token = data.token;
		this.modelType = data.model_type;
		this.title = data.title;
		this.creatorUserToken = data.creator.user_token;
		this.creatorUsername = data.creator.username;
		this.username = data.creator.username;
		this.creatorDisplayName = data.creator.display_name;
		this.creatorGravatarHash = data.creator.gravatar_hash;
		this.creatorSetVisibility = data.creator_set_visibility;
		this.ietfLanguageTag = data.ietf_language_tag;
		this.ietfPrimaryLanguageSubtag = data.ietf_primary_language_subtag;
		this.isFrontPageFeatured = data.is_front_page_featured;
		this.createdAt = data.created_at;
		this.updatedAt = data.updated_at;
	}

	readonly client: Client;

	readonly token: string;
	readonly modelType: string;
	readonly title: string;
	readonly creatorUserToken: string;
	/**
	 * @alias creatorUsername
	 */
	readonly username: string;
	readonly creatorUsername: string;
	readonly creatorDisplayName: string;
	readonly creatorGravatarHash: string;
	readonly creatorSetVisibility: 'public' | 'hidden';
	readonly ietfLanguageTag: string;
	readonly ietfPrimaryLanguageSubtag: string;
	readonly isFrontPageFeatured: boolean;
	readonly createdAt: Date;
	readonly updatedAt: Date;

	async #uploadAudio(file: Buffer): Promise<V2vVoiceUploadResponseSchema | undefined> {
		try {
			const response = await this.client.rest.upload(
				`${constants.API_URL}/v1/media_uploads/upload_audio`,
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
		const response = await this.client.rest.send(`${constants.API_URL}/v1/voice_conversion/inference`, {
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
		return poll(
			async () => {
				const response = await this.client.rest.send(
					`${constants.API_URL}/v1/model_inference/job_status/${inferenceJobToken}`
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
			},
			3000, // 3 seconds, v2v models are slow to infer so well give it a bit more time between requests
			240
		);
	}

	/**
	 * Infer uploaded audio to a new voice represented by this model.
	 *
	 * NOTE: Voice conversion models are very slow to infer. It may take multiple minutes for the inference to complete.
	 *
	 * @param audio The audio to infer as a wav file.
	 * @returns The inferred audio file. Undefined if the audio could not be inferred.
	 */
	async infer(audio: Buffer): Promise<V2vAudioFile | undefined> {
		const uploadedAudio = await this.#uploadAudio(audio);

		if (!uploadedAudio) {
			return;
		}

		const inference = await this.#fetchInference(uploadedAudio.upload_token);

		if (!inference) {
			return;
		}

		const audioUrl = await this.#getAudioUrl(inference.inference_job_token);

		if (audioUrl) {
			return new V2vAudioFile(this.client, audioUrl);
		}
	}

	/**
	 * Fetch the profile of the user who created this model.
	 */
	fetchProfile = implFetchUser;
}
