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
}
