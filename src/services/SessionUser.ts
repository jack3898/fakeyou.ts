import { type SessionUserSchema, loggedInUserProfileResponseSchema } from '../util/validation.js';
import { apiUrl } from '../util/constants.js';
import ProfileUser from './ProfileUser.js';
import { request } from '../util/request.js';

export default class SessionUser {
	constructor(public data: SessionUserSchema) {}

	static async fetchLoggedInUser(): Promise<SessionUser | null> {
		const response = await request(new URL(`${apiUrl}/session`), { method: 'GET' });
		const loggedInUser = loggedInUserProfileResponseSchema.parse(await response.json());

		if (loggedInUser.logged_in) {
			return new this(loggedInUser.user);
		}

		return null;
	}

	fetchProfile(): Promise<ProfileUser> {
		return ProfileUser.fetchUserProfile(this.username);
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
