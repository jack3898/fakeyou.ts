import type { UserBadgeSchema } from '../util/validation.js';

export default class Badge {
	constructor(data: UserBadgeSchema) {
		this.slug = data.slug;
		this.title = data.title;
		this.description = data.description;
		this.imageUrl = data.image_url;
		this.grantedAt = data.granted_at;
	}

	readonly slug: string;

	readonly title: string;

	readonly description: string;

	readonly imageUrl: string;

	readonly grantedAt: Date;
}
