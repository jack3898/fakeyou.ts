import crypto from 'node:crypto';
import Category from '../category/Category.js';
import ProfileUser from '../profileUser/ProfileUser.js';
import TtsAudioFile from '../ttsAudioFile/TtsAudioFile.js';
import {
	type TtsModelSchema,
	ttsModelListSchema,
	type TtsInferenceStatusDoneSchema,
	ttsRequestStatusResponseSchema,
	type RatingSchema,
	userRatingResponseSchema,
	ttsInferenceResultSchema,
	type TtsInferenceResultSchema
} from './ttsModel.schema.js';
import DataLoader from 'dataloader';
import { base64, log, poll, request, constants, cache, PollStatus, sleep } from '../../util/index.js';

export default class TtsModel {
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

	static fetchModels(): Promise<Map<string, TtsModel>> {
		return cache.wrap('fetch-tts-models', async () => {
			const response = await request.send(new URL(`${constants.API_URL}/tts/list`));
			const json = ttsModelListSchema.parse(await response.json());

			const map = new Map<string, TtsModel>();

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
	static async fetchModelByToken(token: string): Promise<TtsModel | null> {
		return (await this.fetchModels()).get(token) || null;
	}

	static async fetchModelsByUser(username: string): Promise<TtsModel[] | null> {
		try {
			const response = await request.send(new URL(`${constants.API_URL}/user/${username}/tts_models`));
			const json = ttsModelListSchema.parse(await response.json());

			return json.models.map((model) => new this(model));
		} catch (error) {
			log.error(`Response from API failed validation. Is that username correct?\n${error}`);

			return null;
		}
	}

	/**
	 * @param search Case-insensitive search query
	 */
	static async fetchModelByName(search: string): Promise<TtsModel | null> {
		const models = await this.fetchModels();

		for (const [, model] of models) {
			if (model.title.toLowerCase().includes(search.toLowerCase())) {
				return model;
			}
		}

		return null;
	}

	// The dataloader must be static, so that multiple different model instances can use it.
	// This does make things harder, however, due to `this` bindings so we need to resort to passing through
	// an encoded the model token to #modelInferenceDataloader so it can fetch the model instance itself :(
	// Thanks to caching, this is not a massive performance problem!
	static #modelDataloader = new DataLoader(TtsModel.#modelInferenceDataloader);

	static async #modelInferenceDataloader(
		base64Queries: readonly `${string}:${string}`[]
	): Promise<(TtsAudioFile | null)[]> {
		if (base64Queries.length > 10) {
			log.warn('TTS batch size is larger than 10, and will take a while to resolve all inferences.');
		}

		const authenticated = request.isAuthenticated();

		if (!authenticated) {
			log.info('You are not logged in to your FakeYou account! Your requests will take longer to process.');
		}

		const models = await TtsModel.fetchModels();
		const results: TtsAudioFile[] = [];
		const startTime = Date.now();

		const decodedQueries: [string, string][] = base64Queries.map((base64Query) => {
			const [text, modelToken] = base64Query.split(':');

			return [base64.decode(text), base64.decode(modelToken)];
		});

		for (const [text, modelToken] of decodedQueries) {
			const model = models.get(modelToken);

			if (!model) {
				continue;
			}

			const end = Date.now() + (authenticated ? 5000 : 12000);
			const inference = await model.#fetchInference(text);

			if (!inference.success) {
				const sleepInterval = 8000;

				log.error(`There was a problem fetching this inference. Will retry in ${sleepInterval / 1000} seconds.`);
				log.error(inference.error_reason);

				await sleep(sleepInterval); // Probably a rate limit. So we'll wait extra long.

				continue;
			}

			const audioUrl = await model.#getAudioUrl(inference.inference_job_token);

			if (!audioUrl) {
				continue;
			}

			log.success(`Inference success for "${text}"`);
			results.push(new TtsAudioFile(audioUrl));

			await sleep(Math.max(end - Date.now(), 0)); // If it resolved fast, wait until x seconds have passed since the start of the request
		}

		const endTime = Date.now();
		const durationSecs = Math.round((endTime - startTime) / 1000);

		log.success(`Finished in ${durationSecs} seconds.`);

		// The return value array must return corresponding data for each item.
		// And be of exactly the same length so the dataloader can tie things back together.
		return decodedQueries.map(([text]) => {
			return results.find((result) => result.rawInferenceText === text) || null;
		});
	}

	async fetchModelCreator(): Promise<ProfileUser | null> {
		return ProfileUser.fetchUserProfile(this.creatorUsername);
	}

	async #fetchInference(text: string): Promise<TtsInferenceResultSchema> {
		const response = await request.send(new URL(`${constants.API_URL}/tts/inference`), {
			method: 'POST',
			body: JSON.stringify({
				tts_model_token: this.token,
				uuid_idempotency_token: crypto.randomUUID(),
				inference_text: text
			})
		});

		const json = await response.json();

		return ttsInferenceResultSchema.parse(json);
	}

	#getAudioUrl(inferenceJobToken: string): Promise<TtsInferenceStatusDoneSchema | null> {
		return poll(async () => {
			const response = await request.send(new URL(`${constants.API_URL}/tts/job/${inferenceJobToken}`));
			const result = ttsRequestStatusResponseSchema.parse(await response.json());

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
	 * Infer text for this model!
	 *
	 * Supports rate limit safety features. You can trigger the rate limit guard by passing multiple `model.infer()` calls in a `Promise.all([...])`
	 */
	infer(text: string): Promise<TtsAudioFile | null> {
		// First encode text to base64, so that users cannot confuse this application when we pass the
		// colon-delimited query string to the dataloader
		const textBase64 = base64.encode(text);
		const modelTokenBase64 = base64.encode(this.token);

		return TtsModel.#modelDataloader.load(`${textBase64}:${modelTokenBase64}`);
	}

	async fetchMyRating(): Promise<RatingSchema | null> {
		try {
			const response = await request.send(new URL(`${constants.API_URL}/v1/user_rating/view/tts_model/${this.token}`));
			const json = userRatingResponseSchema.parse(await response.json());

			return json.maybe_rating_value;
		} catch (error) {
			log.error(`Response from API failed validation. Are you logged in?\n${error}`);

			return null;
		}
	}

	async rate(decision: RatingSchema): Promise<RatingSchema | null> {
		try {
			await request.send(new URL(`${constants.API_URL}/v1/user_rating/rate`), {
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
		const categoryTokens = this.categoryTokens;

		return categories.filter((category) => categoryTokens?.includes(category.token));
	}
}
