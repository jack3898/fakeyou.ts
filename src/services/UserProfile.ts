import { apiUrl } from '../util/constants.js';
import { userProfileResponseSchema, type UserProfileSchema } from '../util/validation.js';
import Rest from './Rest.js';

export default class UserProfile {
	constructor(public data: UserProfileSchema) {}

	static async fetchUserProfile(username: string) {
		const response = await Rest.fetch(new URL(`${apiUrl}/user/${username}/profile`), { method: 'GET' });
		const json = userProfileResponseSchema.parse(await response.json());

		return new this(json.user);
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

	get discordUsername(): string | null {
		return this.data.discord_username;
	}

	get twitchUsername(): string | null {
		return this.data.twitch_username;
	}

	get twitterUsername(): string | null {
		return this.data.twitter_username;
	}

	get patreonUsername(): string | null {
		return this.data.patreon_username;
	}

	get githubUsername(): string | null {
		return this.githubUsername;
	}

	get websiteUrl(): string | null {
		return this.websiteUrl;
	}

	get bio(): string {
		return this.data.profile_markdown;
	}
}
