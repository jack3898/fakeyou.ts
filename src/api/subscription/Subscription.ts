import { type ActiveSubscriptionsResponseSchema } from './subscription.schema.js';

export default class Subscription {
	constructor(data: ActiveSubscriptionsResponseSchema) {
		this.inLoyaltyProgram = data.maybe_loyalty_program;
		this.activeSubscriptions = new Map(data.active_subscriptions.map((sub) => [sub.namespace, sub.product_slug]));
	}

	/**
	 * The key is the product namespace, and value is the product slug.
	 */
	readonly activeSubscriptions: Map<string, string>;
	readonly inLoyaltyProgram: boolean;
}
