import { Category } from '../../api/category/Category.js';
import { categoryListResponseSchema, categoryToModelSchema } from '../../api/category/category.schema.js';
import { Leaderboard } from '../../api/leaderboard/Leaderboard.js';
import { leaderboardResponseSchema } from '../../api/leaderboard/leaderboard.schema.js';
import { ProfileUser } from '../../api/profileUser/ProfileUser.js';
import { userProfileResponseSchema } from '../../api/profileUser/profileUser.schema.js';
import { Queue } from '../../api/queue/Queue.js';
import { queueLengthResponseSchema } from '../../api/queue/queue.schema.js';
import { SessionUser } from '../../api/sessionUser/SessionUser.js';
import { loggedInUserProfileResponseSchema } from '../../api/sessionUser/sessionUser.schema.js';
import { TtsModel } from '../../api/ttsModel/TtsModel.js';
import { ttsModelListSchema } from '../../api/ttsModel/ttsModel.schema.js';
import { V2vModel } from '../../api/v2vModel/V2vModel.js';
import { v2vModelListSchema } from '../../api/v2vModel/v2vModel.schema.js';
import { AuthorisationError } from '../../error/AuthorisationError.js';
import { constants, extractCookieFromHeaders, log, mapify, prettyParse } from '../../util/index.js';
import { Cache } from '../cache/Cache.js';
import { Rest } from '../rest/Rest.js';
import { loginSchema } from './client.schema.js';
import { type CacheKey, type ClientOptions } from './types.js';

/**
 * The FakeYou API client. This is the main entry point for the library.
 * It provides methods to fetch data from the FakeYou API.
 *
 * @example ```ts
 * import { Client } from 'fakeyou.ts';
 *
 * const client = new Client();
 *
 * // Optional
 * await client.login({
 * 	username: 'username',
 * 	password: 'password'
 * });
 * ```
 */
export class Client {
	constructor(options?: ClientOptions) {
		log.setLogging(!!options?.logging);
	}

	readonly rest = new Rest();
	readonly cache = new Cache<CacheKey>();

	/**
	 * Login in with your provided credentials to take advantage of any potential premium benefits.
	 *
	 * This uses session cookies to authenticate you.
	 *
	 * API token authentication is not supported due to the lack of support for it in the API and it not being available to the public.
	 * If you work for FakeYou and can provide a token to test with and want help add support for it, please get in touch.
	 *
	 * @param credentials Your credentials to login with. Email is supported.
	 * @rejects {AuthorisationError} If the credentials are invalid.
	 */
	async login(credentials: { username: string; password: string }): Promise<void> {
		log.info('Logging in...');

		const cookie = await this.cache.wrap('login', async () => {
			const response = await this.rest.send(`${constants.API_URL}/login`, {
				method: 'POST',
				body: JSON.stringify({
					username_or_email: credentials.username,
					password: credentials.password
				})
			});

			const body = prettyParse(loginSchema, await response.json());

			if (!body.success) {
				throw new AuthorisationError(`Authentication failed. Status ${response.status}.`);
			}

			return extractCookieFromHeaders(response.headers);
		});

		this.rest.cookie = cookie;

		log.success('Logged in!');
	}

	/**
	 * Logout of your account. Permanently invalidates the session cookie.
	 * Use `client.login()` to create a new session.
	 *
	 * @returns Whether the logout was successful.
	 */
	async logout(): Promise<boolean> {
		const response = await this.rest.send(`${constants.API_URL}/logout`, { method: 'POST' });
		const { success } = prettyParse(loginSchema, await response.json());

		this.rest.cookie = undefined;
		this.cache.dispose('login');

		return success;
	}

	/**
	 * Fetch all available TTS models.
	 *
	 * This method will return all models available on the website.
	 *
	 * @returns A map of all available models with their token as the key.
	 */
	fetchTtsModels(): Promise<Map<string, TtsModel>> {
		return this.cache.wrap('fetch-tts-models', async () => {
			const response = await this.rest.send(`${constants.API_URL}/tts/list`);
			const json = prettyParse(ttsModelListSchema, await response.json());
			const ttsModels = json.models.map((model) => new TtsModel(this, model));

			return mapify('token', ttsModels);
		});
	}

	/**
	 * Fetch a single TTS model by its token.
	 *
	 * @param token The token of the model to fetch. You can find this in the URL of the model page.
	 * @returns The model.
	 */
	async fetchTtsModelByToken(token: string): Promise<TtsModel | undefined> {
		return this.cache.wrap(`fetch-tts-model-token-${token}`, async () => {
			const models = await this.fetchTtsModels();

			return models.get(token);
		});
	}

	/**
	 * Fetch all models created by a user.
	 *
	 * @param username The username of the user, this is not the display name and is case sensitive.
	 * @returns An array of all models created by the user. Empty array if no models were found.
	 */
	async fetchTtsModelsByUser(username: string): Promise<TtsModel[]> {
		try {
			return this.cache.wrap(`fetch-tts-models-user-${username}`, async () => {
				const response = await this.rest.send(`${constants.API_URL}/user/${username}/tts_models`);
				const json = prettyParse(ttsModelListSchema, await response.json());

				return json.models.map((model) => new TtsModel(this, model));
			});
		} catch (error) {
			log.error(`Response from API failed validation. Is that username correct?\n${error}`);

			return [];
		}
	}

	/**
	 * Fetch a model by its display name. Case insensitive.
	 *
	 * This method will return the first model that contains the search string in its title.
	 * This may not return the right model you are after if there are multiple models with the same substring,
	 * so it is recommended to use `fetchTtsModelByToken` if you know the token of the model.
	 *
	 * @param search The search string (case insensitive).
	 * @returns The model or undefined if no model was found.
	 */
	async fetchTtsModelByName(search: string): Promise<TtsModel | undefined> {
		const searchLowerCase = search.toLowerCase();

		return this.cache.wrap(`fetch-tts-models-name-${searchLowerCase}`, async () => {
			const models = await this.fetchTtsModels();

			for (const model of models.values()) {
				if (model.title.toLowerCase().includes(searchLowerCase)) {
					return model;
				}
			}
		});
	}

	/**
	 * Fetch all available voice conversion models.
	 *
	 * This method will return all models available on the website.
	 *
	 * @returns A map of all available models with their token as the key.
	 */
	fetchV2vModels(): Promise<Map<string, V2vModel>> {
		return this.cache.wrap('fetch-v2v-models', async () => {
			const response = await this.rest.send(`${constants.API_URL}/v1/voice_conversion/model_list`);
			const json = prettyParse(v2vModelListSchema, await response.json());
			const models = json.models.map((modelData) => new V2vModel(this, modelData));

			return mapify('token', models);
		});
	}

	/**
	 * Fetch a voice conversion model by its token. This is tricker to locate, as it is not displayed in the UI or in the URL.
	 * You can find the token by inspecting the network requests on the FakeYou website or by using fetchV2vModelByName and making note of the token.
	 *
	 * @param token The token of the model to fetch.
	 * @returns The voice conversion model.
	 */
	async fetchV2vModelByToken(token: string): Promise<V2vModel | undefined> {
		return this.cache.wrap(`fetch-v2v-models-token-${token}`, async () => {
			const models = await this.fetchV2vModels();

			return models.get(token);
		});
	}

	/**
	 * Fetch a voice conversion model by its display name. Case insensitive.
	 * This method will return the first model that contains the search string in its title.
	 * This may not return the right model you are after if there are multiple models with the same substring,
	 * so it is recommended to use `fetchV2vModelByToken` if you know the token of the model.
	 *
	 * @param search The search string (case insensitive)
	 * @returns The model or undefined if no model was found
	 */
	async fetchV2vModelByName(search: string): Promise<V2vModel | undefined> {
		const searchLowerCase = search.toLowerCase();

		return this.cache.wrap(`fetch-v2v-models-name-${searchLowerCase}`, async () => {
			const models = await this.fetchV2vModels();

			for (const model of models.values()) {
				if (model.title.toLowerCase().includes(searchLowerCase)) {
					return model;
				}
			}
		});
	}

	/**
	 * Fetch all voice-to-voice models created by a user's username.
	 *
	 * @param username The username of the user
	 * @returns An array of all models created by the user
	 */
	async fetchV2vModelsByUser(username: string): Promise<V2vModel[]> {
		return this.cache.wrap(`fetch-v2v-models-user-${username}`, async () => {
			const userModels = await this.fetchV2vModels();

			return Array.from(userModels.values()).filter((model) => model.username === username);
		});
	}

	/**
	 * Fetch the currently logged in user logged in via the login method.
	 *
	 * @returns The logged in user. Undefined if no user is logged in.
	 */
	async fetchLoggedInUser(): Promise<SessionUser | undefined> {
		try {
			const response = await this.rest.send(`${constants.API_URL}/session`);
			const loggedInUser = prettyParse(loggedInUserProfileResponseSchema, await response.json());

			if (loggedInUser.logged_in) {
				return new SessionUser(this, loggedInUser.user);
			}
		} catch (error) {
			log.error(`Response from API failed validation. Could not load session user.\n${error}`);
		}
	}

	/**
	 * Fetch the TTS and W2L leaderboards.
	 *
	 * @returns The leaderboards.
	 */
	fetchLeaderboard(): Promise<Leaderboard> {
		return this.cache.wrap('fetch-leaderboard', async () => {
			const response = await this.rest.send(`${constants.API_URL}/leaderboard`);
			const json = prettyParse(leaderboardResponseSchema, await response.json());

			return new Leaderboard(this, json);
		});
	}

	/**
	 * Fetch a user profile by their username.
	 *
	 * @param username The username of the user to fetch. This is not the display name and is case sensitive.
	 * @returns The user profile, or undefined if the user does not exist.
	 */
	async fetchUserProfile(username: string): Promise<ProfileUser | undefined> {
		try {
			return this.cache.wrap(`fetch-user-profile-${username}`, async () => {
				const response = await this.rest.send(`${constants.API_URL}/user/${username}/profile`);
				const json = prettyParse(userProfileResponseSchema, await response.json());

				return new ProfileUser(this, json.user);
			});
		} catch (error) {
			log.error(
				`Response from API failed validation. Check the username you provided, it can be different to their display name.\n${error}`
			);
		}
	}

	/**
	 * Fetch the current FakeYou TTS queue and other related information.
	 *
	 * This is the number of jobs that are currently waiting to be processed by the FakeYou TTS engine.
	 *
	 * The result is cached for 15 seconds.
	 *
	 * @returns The queue.
	 */
	async fetchQueue(): Promise<Queue> {
		return this.cache.wrap(
			'fetch-queue',
			async () => {
				const response = await this.rest.send(`${constants.API_URL}/v1/stats/queues`);
				const json = prettyParse(queueLengthResponseSchema, await response.json());

				return new Queue(json);
			},
			15_000
		);
	}

	/**
	 * Fetch all available categories which hold TTS models and child categories.
	 *
	 * @returns A list of all available categories including their child categories.
	 */
	async fetchCategories(): Promise<Category[]> {
		return this.cache.wrap('fetch-categories', async () => {
			const response = await this.rest.send(`${constants.API_URL}/category/list/tts`);
			const json = prettyParse(categoryListResponseSchema, await response.json());

			return json.categories.map((category) => new Category(this, category));
		});
	}

	/**
	 * Fetch all root categories which hold TTS models and child categories.
	 * Root categories are categories which have no parent category.
	 *
	 * @returns A list of all root categories.
	 */
	async fetchRootCategories(): Promise<Category[]> {
		return this.cache.wrap('fetch-root-categories', async () => {
			const allCategories = await this.fetchCategories();

			return allCategories.filter((category) => !category.parentToken);
		});
	}

	/**
	 * Fetch all category to model relationships.
	 * This is used to determine which models belong to which categories.
	 *
	 * @returns An object where the key is the category token and the value is an array of model tokens.
	 */
	async fetchCategoryToModelRelationships(): Promise<Record<string, string[]>> {
		return this.cache.wrap('fetch-category-model-relationships', async () => {
			const response = await this.rest.send(`${constants.API_URL}/v1/category/computed_assignments/tts`);
			const json = prettyParse(categoryToModelSchema, await response.json());

			return json.category_token_to_tts_model_tokens.recursive;
		});
	}

	/**
	 * Fetch a category by its token. Categories are used to group TTS models together.
	 * NOTE: Voice conversion models are not grouped into categories so this method will not return any voice conversion model categories.
	 *
	 * @param token The token of the category to fetch.
	 * @returns The category or undefined if no category was found.
	 */
	async fetchCategoryByToken(token: string): Promise<Category | undefined> {
		return this.cache.wrap(`fetch-category-token-${token}`, async () => {
			const categories = await this.fetchCategories();

			return categories.find((category) => category.token === token);
		});
	}
}
