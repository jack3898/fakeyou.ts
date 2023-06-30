import { credentialsSchema, type CredentialsSchema, loginSchema } from '../util/validation.js';
import { apiUrl } from '../util/constants.js';
import AuthorisationError from '../error/AuthorisationError.js';
import Model from './Model.js';
import FakeYouError from '../error/FakeYouError.js';
import SessionUser from './SessionUser.js';
import Rest from './Rest.js';
import Leaderboard from './Leaderboard.js';
import UserProfile from './UserProfile.js';
import Category from './Category.js';
import Cache from './Cache.js';

export default class Client {
	model = Model;

	sessionUser = SessionUser;

	leaderboard = Leaderboard;

	userProfile = UserProfile;

	category = Category;

	/**
	 * Login in with your provided credentials to take advantage of any potential premium benefits.
	 */
	async login(credentials: CredentialsSchema): Promise<void> {
		const cookie = await Cache.wrap(
			'login',
			async () => {
				const validatedCredentials = credentialsSchema.parse(credentials);

				const response = await Rest.fetch(new URL(`${apiUrl}/login`), {
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
			},
			5
		);

		if (!cookie) {
			throw new FakeYouError('Login succeeded but there was a problem processing your session token.');
		}

		Rest.cookie = cookie;
	}

	logout() {
		Rest.cookie = undefined;
	}
}
