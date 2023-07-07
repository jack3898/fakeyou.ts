import { z } from 'zod';
import { productSchema } from '../product/product.schema.js';
import { fakeyouResponse } from '../../global.schema.js';

export type ActiveSubscriptionsResponseSchema = z.infer<typeof activeSubscriptionsResponseSchema>;

export const activeSubscriptionsResponseSchema = fakeyouResponse.extend({
	maybe_loyalty_program: z.boolean({ coerce: true }),
	active_subscriptions: z.array(productSchema)
});
