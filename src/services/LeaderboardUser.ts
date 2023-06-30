import { type LeaderboardUserSchema } from '../util/validation.js';

export default class LeaderboardUser {
	constructor(public data: LeaderboardUserSchema) {}

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
