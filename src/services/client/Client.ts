import AuthorisationError from '../../error/AuthorisationError.js';
import FakeYouError from '../../error/FakeYouError.js';
import { constants, log, prettyParse, extractCookieFromHeaders } from '../../util/index.js';
import Category from '../../api/category/Category.js';
import Leaderboard from '../../api/leaderboard/Leaderboard.js';
import TtsModel from '../../api/ttsModel/TtsModel.js';
import ProfileUser from '../../api/profileUser/ProfileUser.js';
import Queue from '../../api/queue/Queue.js';
import SessionUser from '../../api/sessionUser/SessionUser.js';
import Subscription from '../../api/subscription/Subscription.js';
import UserAudioFile from '../../api/profileUser/userAudioFile/UserAudioFile.js';
import V2vModel from '../../api/v2vmodel/V2vModel.js';
import { loginSchema } from './client.schema.js';
import { Rest } from '../rest/Rest.js';
import { Cache } from '../cache/Cache.js';

export default class Client {
	constructor(options?: { logging?: boolean }) {
		log.setLogging(!!options?.logging);

		this.ttsModel.client = this;
		this.v2vModel.client = this;
		this.sessionUser.client = this;
		this.leaderboard.client = this;
		this.userProfile.client = this;
		this.category.client = this;
		this.queue.client = this;
		this.userSubscription.client = this;
		this.userTtsAudioHistory.client = this;
	}

	readonly rest = new Rest();
	readonly cache = new Cache();

	readonly ttsModel = TtsModel;
	readonly v2vModel = V2vModel;
	readonly sessionUser = SessionUser;
	readonly leaderboard = Leaderboard;
	readonly userProfile = ProfileUser;
	readonly category = Category;
	readonly queue = Queue;
	readonly userSubscription = Subscription;
	readonly userTtsAudioHistory = UserAudioFile;

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
			const response = await this.rest.send(new URL(`${constants.API_URL}/login`), {
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

		if (!cookie) {
			throw new FakeYouError('Login succeeded but there was a problem processing your session token.');
		}

		this.rest.cookie = cookie;

		log.success('Logged in!');
	}

	/**
	 * Logout of your account. Removes the session token from the client and FakeYou's servers.
	 *
	 * @returns Whether the logout was successful.
	 */
	async logout(): Promise<boolean> {
		const response = await this.rest.send(new URL(`${constants.API_URL}/logout`), { method: 'POST' });
		const { success } = prettyParse(loginSchema, await response.json());

		this.rest.cookie = undefined;
		this.cache.dispose('login');

		return success;
	}
}
