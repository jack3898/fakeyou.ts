import AuthorisationError from '../../error/AuthorisationError.js';
import FakeYouError from '../../error/FakeYouError.js';
import { constants, cache, log, request, prettyParse } from '../../util/index.js';
import Category from '../category/Category.js';
import Leaderboard from '../leaderboard/Leaderboard.js';
import TtsModel from '../ttsModel/TtsModel.js';
import ProfileUser from '../profileUser/ProfileUser.js';
import Queue from '../queue/Queue.js';
import SessionUser from '../sessionUser/SessionUser.js';
import Subscription from '../subscription/Subscription.js';
import UserAudioFile from '../userAudioFile/UserAudioFile.js';
import V2vModel from '../v2vmodel/V2vModel.js';
import { loginSchema } from './client.schema.js';

export default class Client {
	constructor(options?: { logging?: boolean }) {
		log.setLogging(!!options?.logging);
	}

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
	 */
	async login(credentials: { username: string; password: string }): Promise<void> {
		log.info('Logging in...');

		const cookie = await cache.wrap('login', async () => {
			const response = await request.send(new URL(`${constants.API_URL}/login`), {
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

			return response.headers
				.get('set-cookie')
				?.match(/^\w+.=([^;]+)/)
				?.at(1);
		});

		if (!cookie) {
			throw new FakeYouError('Login succeeded but there was a problem processing your session token.');
		}

		request.setCookie(cookie);

		log.success('Logged in!');
	}

	async logout(): Promise<boolean> {
		const response = await request.send(new URL(`${constants.API_URL}/logout`), { method: 'POST' });
		const { success } = prettyParse(loginSchema, await response.json());

		request.setCookie(undefined);
		cache.dispose('login');

		return success;
	}
}
