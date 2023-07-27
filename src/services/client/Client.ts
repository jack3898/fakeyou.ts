import V2vModel from '../../api/v2vModel/V2vModel.js';
import { v2vModelListSchema } from '../../api/v2vModel/v2vModel.schema.js';
import Category from '../../api/category/Category.js';
import { categoryListResponseSchema, categoryToModelSchema } from '../../api/category/category.schema.js';
import Leaderboard from '../../api/leaderboard/Leaderboard.js';
import { leaderboardResponseSchema } from '../../api/leaderboard/leaderboard.schema.js';
import ProfileUser from '../../api/profileUser/ProfileUser.js';
import { userProfileResponseSchema } from '../../api/profileUser/profileUser.schema.js';
import Queue from '../../api/queue/Queue.js';
import { queueLengthResponseSchema } from '../../api/queue/queue.schema.js';
import SessionUser from '../../api/sessionUser/SessionUser.js';
import { loggedInUserProfileResponseSchema } from '../../api/sessionUser/sessionUser.schema.js';
import TtsModel from '../../api/ttsModel/TtsModel.js';
import { ttsModelListSchema } from '../../api/ttsModel/ttsModel.schema.js';
import AuthorisationError from '../../error/AuthorisationError.js';
import { constants, extractCookieFromHeaders, log, mapify, prettyParse } from '../../util/index.js';
import { Cache } from '../cache/Cache.js';
import { Rest } from '../rest/Rest.js';
import { loginSchema } from './client.schema.js';

export class Client {
	constructor(options?: { logging?: boolean }) {
		log.setLogging(!!options?.logging);
	}

	readonly rest = new Rest();
	readonly cache = new Cache();

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
	 * Logout of your account. Removes the session token from the client and FakeYou's servers.
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
			const ttsModels = json.models.map((model) => new TtsModel(model, this));

			return mapify('token', ttsModels);
		});
	}

	/**
	 * Fetch a TTS model by its token. This is a convenience method for `TtsModel.fetchModels()`.
	 *
	 * @param token The token of the model to fetch
	 * @returns The model
	 */
	async fetchTtsModelByToken(token: string): Promise<TtsModel | undefined> {
		const models = await this.fetchTtsModels();

		return models.get(token);
	}

	/**
	 * Fetch all models created by a user.
	 *
	 * @param username The username of the user
	 * @returns An array of all models created by the user
	 */
	async fetchTtsModelsByUser(username: string): Promise<TtsModel[]> {
		try {
			const response = await this.rest.send(`${constants.API_URL}/user/${username}/tts_models`);
			const json = prettyParse(ttsModelListSchema, await response.json());

			return json.models.map((model) => new TtsModel(model, this));
		} catch (error) {
			log.error(`Response from API failed validation. Is that username correct?\n${error}`);

			return [];
		}
	}

	/**
	 * Fetch a model by its name.
	 *
	 * This method will return the first model that contains the search string in its title.
	 *
	 * @param search The search string (case insensitive)
	 * @returns The model or undefined if no model was found
	 */
	async fetchTtsModelByName(search: string): Promise<TtsModel | undefined> {
		const models = await this.fetchTtsModels();

		for (const model of models.values()) {
			if (model.title.toLowerCase().includes(search.toLowerCase())) {
				return model;
			}
		}
	}

	/**
	 * Fetch all available voice conversion models.
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
	 * Fetch a voice conversion model by its token.
	 *
	 * @param token The token of the model to fetch
	 * @returns The model
	 */
	async fetchV2vModelByToken(token: string): Promise<V2vModel | undefined> {
		const models = await this.fetchV2vModels();

		return models.get(token);
	}

	/**
	 * Fetch all voice-to-voice models by its name.
	 *
	 * This method will return the first model that contains the search string in its title.
	 *
	 * @param search The search string (case insensitive)
	 * @returns The model or undefined if no model was found
	 */
	async fetchV2vModelByName(search: string): Promise<V2vModel | undefined> {
		const models = await this.fetchV2vModels();

		for (const model of models.values()) {
			if (model.title.toLowerCase().includes(search.toLowerCase())) {
				return model;
			}
		}
	}

	/**
	 * Fetch all voice-to-voice models created by a user's username.
	 *
	 * @param username The username of the user
	 * @returns An array of all models created by the user
	 */
	async fetchV2vModelsByUser(username: string): Promise<V2vModel[]> {
		const userModels = await this.fetchV2vModels();

		return Array.from(userModels.values()).filter((model) => model.username === username);
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
	 * Fetch the leaderboard. This is a global leaderboard of the top contributors to the site.
	 *
	 * @returns The leaderboard
	 */
	async fetchLeaderboard(): Promise<Leaderboard> {
		const json = await this.cache.wrap('fetch-leaderboard', async () => {
			const response = await this.rest.send(`${constants.API_URL}/leaderboard`);

			return prettyParse(leaderboardResponseSchema, await response.json());
		});

		return new Leaderboard(this, json);
	}

	/**
	 * Fetch a user profile by their username.
	 *
	 * @param username The username of the user to fetch
	 * @returns The user profile, or undefined if the user does not exist
	 */
	async fetchUserProfile(username: string): Promise<ProfileUser | undefined> {
		try {
			const json = await this.cache.wrap('fetch-user-profile', async () => {
				const response = await this.rest.send(`${constants.API_URL}/user/${username}/profile`);

				return prettyParse(userProfileResponseSchema, await response.json());
			});

			return new ProfileUser(this, json.user);
		} catch (error) {
			log.error(
				`Response from API failed validation. Check the username you provided, it can be different to their display name.\n${error}`
			);
		}
	}

	/**
	 * Fetch the current FakeYou TTS queue.
	 *
	 * This is the number of jobs that are currently waiting to be processed by the FakeYou TTS engine.
	 *
	 * @returns The queue
	 */
	async fetchQueue(): Promise<Queue> {
		const response = await this.rest.send(`${constants.API_URL}/tts/queue_length`);
		const json = prettyParse(queueLengthResponseSchema, await response.json());

		return new Queue(json);
	}

	/**
	 * Fetch all available categories which hold tts models and child categories.
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
	 * Fetch all root categories which hold tts models and child categories. Root categories are categories which have no parent category.
	 *
	 * @returns A list of all root categories.
	 */
	async fetchRootCategories(): Promise<Category[]> {
		const allCategories = await this.fetchCategories();

		return allCategories.filter((category) => !category.parentToken);
	}

	/**
	 * Fetch all category to model relationships. This is used to determine which models belong to which categories.
	 *
	 * @returns A map of category tokens to tts model tokens.
	 */
	async fetchCategoryToModelRelationships(): Promise<Record<string, string[]>> {
		return this.cache.wrap('fetch-category-model-relationships', async () => {
			const response = await this.rest.send(`${constants.API_URL}/v1/category/computed_assignments/tts`);
			const json = prettyParse(categoryToModelSchema, await response.json());

			return json.category_token_to_tts_model_tokens.recursive;
		});
	}

	/**
	 * Fetch a category by its token.
	 *
	 * @param token The token of the category to fetch
	 * @returns The category
	 */
	async fetchCategoryByToken(token: string): Promise<Category | undefined> {
		const categories = await this.fetchCategories();

		return categories.find((category) => category.token === token);
	}
}
