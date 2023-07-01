import FakeYouError from '../error/FakeYouError.js';
import { type LeaderboardUserSchema } from '../util/validation.js';
import ProfileUser from './ProfileUser.js';

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

	async fetchProfile(): Promise<ProfileUser> {
		const profileUser = await ProfileUser.fetchUserProfile(this.username);

		if (profileUser) {
			return profileUser;
		}

		throw new FakeYouError('Fetch of user profile failed.');
	}
}
