import { constants } from '../../util/index.js';
import { type ActiveSubscriptionsResponseSchema } from './subscription.schema.js';

/**
 * The user's subscription information.
 */
export class Subscription {
	/**
	 * @param data The raw subscription data from the FakeYou API.
	 */
	constructor(data: ActiveSubscriptionsResponseSchema) {
		this.webUrl = `${constants.SITE_URL}/pricing`;

		this.inLoyaltyProgram = data.maybe_loyalty_program;
		this.activeSubscriptions = new Map(data.active_subscriptions.map((sub) => [sub.namespace, sub.product_slug]));
	}

	/**
	 * The URL to the pricing page.
	 */
	readonly webUrl: string;

	/**
	 * The key is the product namespace, and value is the product slug.
	 * The product name is an identifier for the product and the namespace is the type of product.
	 *
	 * @example Map(1) { 'fakeyou' => 'fakeyou_elite' }
	 */
	readonly activeSubscriptions: Map<string, string>;
	/**
	 * Whether the user is in the loyalty program. FakeYou has a free premium loyalty tier for contributors that upload 10 or more TTS or VC models.
	 */
	readonly inLoyaltyProgram: boolean;
}
