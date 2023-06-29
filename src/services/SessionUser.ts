import { type SessionUserSchema, loggedInUserProfileResponseSchema } from '../util/validation.js';
import Rest from './Rest.js';
import { apiUrl } from '../util/constants.js';

export default class SessionUser {
	constructor(data: SessionUserSchema) {
		this.data = data;
	}

	readonly data: SessionUserSchema;

	static async getLoggedInUser(): Promise<SessionUser | null> {
		const response = await Rest.fetch(new URL(`${apiUrl}/session`), { method: 'GET' });
		const loggedInUser = loggedInUserProfileResponseSchema.parse(await response.json());

		if (loggedInUser.logged_in) {
			return new this(loggedInUser.user);
		}

		return null;
	}

	get userToken(): string {
		return this.data.user_token;
	}

	get username(): string {
		return this.data.username;
	}

	get displayName(): string {
		return this.data.display_name;
	}

	get emailGravatarHash(): string {
		return this.data.email_gravatar_hash;
	}
}
