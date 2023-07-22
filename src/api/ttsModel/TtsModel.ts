import crypto from 'node:crypto';
import { type default as Client, type ProfileUser } from '../../index.js';
import { PollStatus, constants, log, poll, prettyParse } from '../../util/index.js';
import type Category from '../category/Category.js';
import TtsAudioFile from './ttsAudioFile/TtsAudioFile.js';
import {
	ttsInferenceResultSchema,
	ttsRequestStatusResponseSchema,
	userRatingResponseSchema,
	type RatingSchema,
	type TtsInferenceResultSchema,
	type TtsInferenceStatusDoneSchema,
	type TtsModelSchema
} from './ttsModel.schema.js';

export default class TtsModel {
	constructor(data: TtsModelSchema, client: Client) {
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

		this.client = client;
	}

	readonly token: string;
	readonly ttsModelType: string;
	readonly creatorToken: string;
	readonly creatorUsername: string;
	readonly creatorDisplayName: string;
	readonly creatorGravatarHash: string;
	readonly title: string;
	readonly ietfLanguageTag: string;
	readonly ietfPrimaryLanguageSubtag: string;
	readonly isFrontPageFeatured: boolean;
	readonly isTwitchFeatured: boolean;
	readonly suggestedUniqueBotCommand: string | null;
	readonly categoryTokens: string[] | null;
	readonly createdAt: Date;
	readonly updatedAt: Date;

	client: Client;

	async #fetchInference(text: string): Promise<TtsInferenceResultSchema> {
		const response = await this.client.rest.send(new URL(`${constants.API_URL}/tts/inference`), {
			method: 'POST',
			body: JSON.stringify({
				tts_model_token: this.token,
				uuid_idempotency_token: crypto.randomUUID(),
				inference_text: text
			})
		});

		return prettyParse(ttsInferenceResultSchema, await response.json());
	}

	#getAudioUrl(inferenceJobToken: string): Promise<TtsInferenceStatusDoneSchema | undefined> {
		return poll(async () => {
			const response = await this.client.rest.send(new URL(`${constants.API_URL}/tts/job/${inferenceJobToken}`));
			const result = prettyParse(ttsRequestStatusResponseSchema, await response.json());

			switch (result.state.status) {
				case 'pending':
					return PollStatus.Retry;
				case 'started':
					return PollStatus.Retry;
				case 'complete_success':
					return result.state;
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
	 * Infer text for this model.
	 *
	 * Supports rate limit safety features. You can trigger the rate limit guard by passing multiple `model.infer()` calls in a `Promise.all([...])`
	 */
	async infer(text: string): Promise<TtsAudioFile | undefined> {
		const inference = await this.#fetchInference(text);
		const audio = inference.success && (await this.#getAudioUrl(inference.inference_job_token));

		if (audio) {
			return new TtsAudioFile(audio, this.client);
		}
	}

	/**
	 * Fetch the rating of this model by the currently logged in user.
	 *
	 * @returns The rating of this model by the currently logged in user. Ratings can be 'positive', 'negative', or 'neutral'. Undefined if no user is logged in.
	 */
	async fetchMyRating(): Promise<RatingSchema | undefined> {
		try {
			const response = await this.client.rest.send(
				new URL(`${constants.API_URL}/v1/user_rating/view/tts_model/${this.token}`)
			);
			const json = prettyParse(userRatingResponseSchema, await response.json());

			return json.maybe_rating_value;
		} catch (error) {
			log.error(`Response from API failed validation. Are you logged in?\n${error}`);
		}
	}

	/**
	 * Fetch the user who created this model. This is a convenience method for `ProfileUser.fetchUserProfile(model.creatorUsername)`.
	 *
	 * @returns The user who created this model
	 */
	fetchModelCreator(): Promise<ProfileUser | undefined> {
		return this.client.fetchUserProfile(this.creatorUsername);
	}

	/**
	 * Rate this model positively, negatively, or neutrally.
	 *
	 * @param decision The rating. Can be 'positive', 'negative', or 'neutral'.
	 * @returns The new rating of this model by the currently logged in user. Undefined if no user is logged in.
	 */
	async rate(decision: RatingSchema): Promise<RatingSchema | undefined> {
		try {
			await this.client.rest.send(new URL(`${constants.API_URL}/v1/user_rating/rate`), {
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
		}
	}

	/**
	 * Fetch the parent categories of this model.
	 *
	 * @returns The parent categories of this model. The array will be empty if no categories are found.
	 */
	async fetchParentCategories(): Promise<Category[]> {
		const categories = await this.client.fetchCategories();
		const categoryTokens = this.categoryTokens;

		return categories.filter((category) => categoryTokens?.includes(category.token));
	}
}
