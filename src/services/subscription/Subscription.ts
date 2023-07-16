import { constants, log, prettyParse, request } from '../../util/index.js';
import { type ActiveSubscriptionsResponseSchema, activeSubscriptionsResponseSchema } from './subscription.schema.js';

export default class Subscription {
	constructor(data: ActiveSubscriptionsResponseSchema) {
		this.inLoyaltyProgram = data.maybe_loyalty_program;
		this.activeSubscriptions = new Map(data.active_subscriptions.map((sub) => [sub.namespace, sub.product_slug]));
	}

	readonly inLoyaltyProgram: boolean;
	/**
	 * The key is the product namespace, and value is the product slug
	 */
	readonly activeSubscriptions: Map<string, string>;

	static async fetchSubscriptions(): Promise<Subscription | undefined> {
		try {
			const response = await request.send(new URL(`${constants.API_URL}/v1/billing/active_subscriptions`));
			const json = prettyParse(activeSubscriptionsResponseSchema, await response.json());

			return new this(json);
		} catch (error) {
			log.error(`Response from API failed validation. Are you logged in?\n${error}`);
		}
	}
}
