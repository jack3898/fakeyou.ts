import FakeYouError from '../../../error/FakeYouError.js';
import ProfileUser from '../../profileUser/ProfileUser.js';
import { type LeaderboardUserSchema } from './leaderboardUser.schema.js';

export default class LeaderboardUser {
	constructor(public data: LeaderboardUserSchema) {
		this.creatorUserToken = data.creator_user_token;
		this.username = data.username;
		this.displayName = data.display_name;
		this.gravatarHash = data.gravatar_hash;
		this.defaultAvatarIndex = data.default_avatar_index;
		this.defaultAvatarColorIndex = data.default_avatar_color_index;
		this.uploadedCount = data.uploaded_count;
	}

	readonly creatorUserToken: string;
	readonly username: string;
	readonly displayName: string;
	readonly gravatarHash: string;
	readonly defaultAvatarIndex: number;
	readonly defaultAvatarColorIndex: number;
	readonly uploadedCount: number;

	/**
	 * Fetch the profile of the user. This contains more information than the leaderboard user.
	 *
	 * @returns The profile of the user in the leaderboard.
	 * @throws {FakeYouError} Fetch of user profile failed.
	 */
	async fetchProfile(): Promise<ProfileUser> {
		const profileUser = await ProfileUser.fetchUserProfile(this.username);

		if (profileUser) {
			return profileUser;
		}

		throw new FakeYouError('Fetch of user profile failed.');
	}
}
