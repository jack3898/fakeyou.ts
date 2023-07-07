import { constants, log, request } from '../../util/index.js';
import Product from '../product/Product.js';
import { type ActiveSubscriptionsResponseSchema, activeSubscriptionsResponseSchema } from './subscription.schema.js';

export default class Subscription {
	constructor(data: ActiveSubscriptionsResponseSchema) {
		this.loyaltyProgram = data.maybe_loyalty_program;
		this.activeSubscriptions = data.active_subscriptions.map((product) => new Product(product));
	}

	readonly loyaltyProgram: boolean;
	readonly activeSubscriptions: Product[];

	static async fetchSubscriptions(): Promise<Subscription | undefined> {
		try {
			const response = await request.send(new URL(`${constants.API_URL}/v1/billing/active_subscriptions`));
			const json = activeSubscriptionsResponseSchema.parse(await response.json());

			return new this(json);
		} catch (error) {
			log.error(`Response from API failed validation. Are you logged in?\n${error}`);
		}
	}
}
