import { type LeaderboardUserSchema } from '../util/validation.js';
import UserProfile from './UserProfile.js';

export default class LeaderboardUser {
	constructor(public data: LeaderboardUserSchema) {}

	fetchProfile(): Promise<UserProfile> {
		return UserProfile.fetchUserProfile(this.username);
	}

	get username(): string {
		return this.data.username;
	}

	get displayName(): string {
		return this.data.display_name;
	}

	get uploadedCount(): number {
		return this.data.uploaded_count;
	}
}
