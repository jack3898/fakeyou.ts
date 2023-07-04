import { cache, constants, request, upload } from '../../util/index.js';
import {
	type V2vModelSchema,
	v2vModelListSchema,
	type V2vVoiceUploadResponseSchema,
	v2vVoiceUploadResponseSchema
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

	static fetchModels(): Promise<Map<string, V2vModel>> {
		return cache.wrap('fetch-v2v-models', async () => {
			const response = await request.send(new URL(`${constants.API_URL}/v1/voice_conversion/model_list`));
			const json = v2vModelListSchema.parse(await response.json());

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
	static async fetchModelByToken(token: string): Promise<V2vModel | null> {
		return (await this.fetchModels()).get(token) || null;
	}

	// TODO: make private member! Public at the moment for testing.
	static async uploadAudio(file: Buffer): Promise<V2vVoiceUploadResponseSchema> {
		const response = await upload.wav(new URL(`${constants.API_URL}/v1/media_uploads/upload_audio`), file);

		return v2vVoiceUploadResponseSchema.parse(await response.json());
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async #fetchInference(uploadToken: string): Promise<unknown> {
		throw TypeError('This method is not implemented.');
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	#getAudioUrl(inferenceJobToken: string): Promise<unknown | null> {
		throw TypeError('This method is not implemented.');
	}

	/**
	 * Infer text for this model!
	 *
	 * Supports rate limit safety features. You can trigger the rate limit guard by passing multiple `model.infer()` calls in a `Promise.all([...])`
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	infer(audio: Buffer): Promise<unknown | null> {
		throw TypeError('This method is not implemented.');
	}
}
