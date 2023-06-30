import type { UserBadgeSchema } from '../util/validation.js';

export default class Badge {
	constructor(public data: UserBadgeSchema) {}

	get slug(): string {
		return this.data.slug;
	}

	get title(): string {
		return this.data.title;
	}

	get description(): string {
		return this.data.description;
	}

	get imageUrl(): string {
		return this.data.image_url;
	}

	get grantedAt(): Date {
		return this.data.granted_at;
	}
}
