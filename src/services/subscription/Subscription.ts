import { apiUrl } from '../../util/constants.js';
import { log } from '../../util/log.js';
import { request } from '../../util/request.js';
import Product from '../product/Product.js';
import { type ActiveSubscriptionsResponseSchema, activeSubscriptionsResponseSchema } from './subscription.schema.js';

export default class Subscription {
	constructor(data: ActiveSubscriptionsResponseSchema) {
		this.loyaltyProgram = data.maybe_loyalty_program;
		this.activeSubscriptions = data.active_subscriptions.map((product) => new Product(product));
	}

	readonly loyaltyProgram: boolean;
	readonly activeSubscriptions: Product[];

	static async fetchSubscriptions(): Promise<Subscription | null> {
		try {
			const response = await request(new URL(`${apiUrl}/v1/billing/active_subscriptions`));
			const json = activeSubscriptionsResponseSchema.parse(await response.json());

			return new this(json);
		} catch (error) {
			log.error(`Response from API failed validation. Are you logged in?\n${error}`);

			return null;
		}
	}
}
