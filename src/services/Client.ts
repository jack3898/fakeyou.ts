import { credentialsSchema, type CredentialsSchema, loginSchema } from '../util/validation.js';
import { apiUrl } from '../util/constants.js';
import AuthorisationError from '../error/AuthorisationError.js';
import Model from './Model.js';
import FakeYouError from '../error/FakeYouError.js';
import SessionUser from './SessionUser.js';
import Leaderboard from './Leaderboard.js';
import ProfileUser from './ProfileUser.js';
import Category from './Category.js';
import { cache, dispose } from '../util/cache.js';
import { request, setCookie } from '../util/request.js';
import { log, setLogging } from '../util/log.js';
import Queue from './Queue.js';
import Subscription from './Subscription.js';

export default class Client {
	readonly model = Model;

	readonly sessionUser = SessionUser;

	readonly leaderboard = Leaderboard;

	readonly userProfile = ProfileUser;

	readonly category = Category;

	readonly queue = Queue;

	readonly userSubscription = Subscription;

	constructor(options?: { logging?: boolean }) {
		setLogging(!!options?.logging);
	}

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

	logout() {
		dispose('login');
		setCookie(undefined);
	}
}
