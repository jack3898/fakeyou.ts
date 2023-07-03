import AuthorisationError from '../../error/AuthorisationError.js';
import FakeYouError from '../../error/FakeYouError.js';
import { cache, dispose } from '../../util/cache.js';
import { apiUrl } from '../../util/constants.js';
import { log, setLogging } from '../../util/log.js';
import { request, setCookie } from '../../util/request.js';
import Category from '../category/Category.js';
import Leaderboard from '../leaderboard/Leaderboard.js';
import Model from '../model/Model.js';
import ProfileUser from '../profileUser/ProfileUser.js';
import Queue from '../queue/Queue.js';
import SessionUser from '../sessionUser/SessionUser.js';
import Subscription from '../subscription/Subscription.js';
import UserAudioFile from '../userAudioFile/UserAudioFile.js';
import { credentialsSchema, type CredentialsSchema, loginSchema } from './client.schema.js';

export default class Client {
	constructor(options?: { logging?: boolean }) {
		setLogging(!!options?.logging);
	}

	readonly model = Model;
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
	async login(credentials: CredentialsSchema): Promise<void> {
		log.info('Logging in...');

		const cookie = await cache('login', async () => {
			const validatedCredentials = credentialsSchema.parse(credentials);

			const response = await request(new URL(`${apiUrl}/login`), {
				method: 'POST',
				body: JSON.stringify({
					username_or_email: validatedCredentials.username,
					password: validatedCredentials.password
				})
			});

			const body = loginSchema.parse(await response.json());

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

		setCookie(cookie);

		log.success('Logged in!');
	}

	logout(): void {
		dispose('login');
		setCookie(undefined);
	}
}
