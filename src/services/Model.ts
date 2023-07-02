import crypto from 'node:crypto';
import { cache } from '../util/cache.js';
import { apiUrl } from '../util/constants.js';
import { log } from '../util/log.js';
import { poll } from '../util/poll.js';
import { request } from '../util/request.js';
import {
	ttsInferenceSchena,
	ttsModelListSchema,
	ttsRequestStatusResponseSchema,
	userRatingResponseSchema,
	type RatingSchema,
	type TtsInferenceSchema,
	type TtsInferenceStatusDoneSchema,
	type TtsModelSchema
} from '../util/validation.js';
import Category from './Category.js';
import ProfileUser from './ProfileUser.js';
import TtsAudioFile from './TtsAudioFile.js';

export default class Model {
	constructor(data: TtsModelSchema) {
		this.token = data.model_token;
		this.ttsModelType = data.tts_model_type;
		this.creatorToken = data.creator_user_token;
		this.creatorUsername = data.creator_username;
		this.creatorDisplayName = data.creator_display_name;
		this.creatorGravatarHash = data.creator_gravatar_hash;
		this.title = data.title;
		this.ietfLanguageTag = data.ietf_language_tag;
		this.ietfPrimaryLanguageSubtag = data.ietf_primary_language_subtag;
		this.isFrontPageFeatured = data.is_front_page_featured;
		this.isTwitchFeatured = data.is_twitch_featured;
		this.suggestedUniqueBotCommand = data.maybe_suggested_unique_bot_command;
		this.categoryTokens = data.category_tokens;
		this.createdAt = data.created_at;
		this.updatedAt = data.updated_at;
	}

	token: string;

	ttsModelType: string;

	creatorToken: string;

	creatorUsername: string;

	creatorDisplayName: string;

	creatorGravatarHash: string;

	title: string;

	ietfLanguageTag: string;

	ietfPrimaryLanguageSubtag: string;

	isFrontPageFeatured: boolean;

	isTwitchFeatured: boolean;

	suggestedUniqueBotCommand: string | null;

	categoryTokens: string[] | null;

	createdAt: Date;

	updatedAt: Date;

	static fetchModels(): Promise<Map<string, Model>> {
		return cache('fetch-models', async () => {
			const response = await request(new URL(`${apiUrl}/tts/list`), { method: 'GET' });
			const json = ttsModelListSchema.parse(await response.json());

			const map = new Map<string, Model>();

			for (const modelData of json.models) {
				map.set(modelData.model_token, new this(modelData));
			}

			return map;
		});
	}

	/**
	 * This is the fastest method to find the model you need, the token is unique to each model and
	 * can be found in the URL of the model's more details page on fakeyou.com.
	 */
	static async fetchModelByToken(token: string): Promise<Model | null> {
		return (await this.fetchModels()).get(token) || null;
	}

	static async fetchModelsByUser(username: string): Promise<Model[] | null> {
		try {
			const response = await request(new URL(`${apiUrl}/user/${username}/tts_models`));
			const json = ttsModelListSchema.parse(await response.json());

			return json.models.map((model) => new this(model));
		} catch (error) {
			log.error(`Response from API failed validation. Is that username correct?\n${error}`);

			return null;
		}
	}

	async fetchModelCreator(): Promise<ProfileUser | null> {
		return ProfileUser.fetchUserProfile(this.creatorUsername);
	}

	private async fetchInference(text: string): Promise<TtsInferenceSchema> {
		const response = await request(new URL(`${apiUrl}/tts/inference`), {
			method: 'POST',
			body: JSON.stringify({
				tts_model_token: this.token,
				uuid_idempotency_token: crypto.randomUUID(),
				inference_text: text
			})
		});

		return ttsInferenceSchena.parse(await response.json());
	}

	private getAudioUrl(inferenceJobToken: string): Promise<TtsInferenceStatusDoneSchema | null> {
		return poll(async () => {
			const response = await request(new URL(`${apiUrl}/tts/job/${inferenceJobToken}`), { method: 'GET' });
			const result = ttsRequestStatusResponseSchema.parse(await response.json());

			switch (result.state.status) {
				case 'pending':
					return poll.Status.Retry;
				case 'started':
					return poll.Status.Retry;
				case 'complete_success':
					return result.state;
				case 'attempt_failed':
					return poll.Status.Retry;
				case 'complete_failure':
					return poll.Status.Abort;
				case 'dead':
					return poll.Status.Abort;
				default:
					return poll.Status.Abort;
			}
		});
	}

	async infer(text: string): Promise<TtsAudioFile | null> {
		const inference = await this.fetchInference(text);
		const data = await this.getAudioUrl(inference.inference_job_token);

		if (data) {
			return new TtsAudioFile(data);
		}

		return null;
	}

	async fetchMyRating(): Promise<RatingSchema | null> {
		try {
			const response = await request(new URL(`${apiUrl}/v1/user_rating/view/tts_model/${this.token}`));
			const json = userRatingResponseSchema.parse(await response.json());

			return json.maybe_rating_value;
		} catch (error) {
			log.error(`Response from API failed validation. Are you logged in?\n${error}`);

			return null;
		}
	}

	async rate(decision: RatingSchema): Promise<RatingSchema | null> {
		try {
			await request(new URL(`${apiUrl}/v1/user_rating/rate`), {
				method: 'POST',
				body: JSON.stringify({
					entity_type: 'tts_model',
					entity_token: this.token,
					rating_value: decision
				})
			});

			return this.fetchMyRating();
		} catch (error) {
			log.error(`Unable to apply rating. Are you logged in?\n${error}`);

			return null;
		}
	}

	async fetchParentCategories(): Promise<Category[]> {
		const categories = await Category.fetchCategories();

		if (this.categoryTokens) {
			return [];
		}

		return categories.filter((category) => this.categoryTokens?.includes(category.token));
	}
}
