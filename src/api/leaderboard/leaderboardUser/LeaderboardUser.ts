import { implFetchUser, type User } from '../../../implementation/index.js';
import Client from '../../../index.js';
import { type LeaderboardUserSchema } from './leaderboardUser.schema.js';

/**
 * A user in the leaderboard.
 * The data here is limited compared to a profile user.
 */
export class LeaderboardUser implements User {
	/**
	 * @param client The main client.
	 * @param data The raw leaderboard user data from the FakeYou API.
	 */
	constructor(client: Client, data: LeaderboardUserSchema) {
		this.client = client;

		this.creatorUserToken = data.creator_user_token;
		this.username = data.username;
		this.displayName = data.display_name;
		this.gravatarHash = data.gravatar_hash;
		this.defaultAvatarIndex = data.default_avatar_index;
		this.defaultAvatarColorIndex = data.default_avatar_color_index;
		this.uploadedCount = data.uploaded_count;
	}

	readonly client: Client;

	readonly creatorUserToken: string;
	readonly username: string;
	readonly displayName: string;
	readonly gravatarHash: string;
	readonly defaultAvatarIndex: number;
	readonly defaultAvatarColorIndex: number;
	readonly uploadedCount: number;

	/**
	 * Fetch the full user profile for this user, which includes more data than the leaderboard user.
	 */
	fetchProfile = implFetchUser;
}
