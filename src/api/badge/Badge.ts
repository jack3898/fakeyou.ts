import { type UserBadgeSchema } from './badge.schema.js';

/**
 * A badge that a user has displayed on their profile.
 * Badges are awarded to the user when they reach certain milestones.
 */
export class Badge {
	/**
	 * @param data The raw badge data from the FakeYou API.
	 */
	constructor(data: UserBadgeSchema) {
		this.slug = data.slug;
		this.title = data.title;
		this.description = data.description;
		this.imageUrl = data.image_url;
		this.grantedAt = data.granted_at;
	}

	/**
	 * The badge slug. This is a unique identifier for the badge.
	 */
	readonly slug: string;
	/**
	 * The badge title. This is the name of the badge.
	 */
	readonly title: string;
	/**
	 * The badge description. This is a short description of the badge and how it was earned.
	 */
	readonly description: string;
	/**
	 * The URL to the badge image, at least in theory. This data is available from the API but the URL may be an empty string.
	 */
	readonly imageUrl: string;
	readonly grantedAt: Date;
}
