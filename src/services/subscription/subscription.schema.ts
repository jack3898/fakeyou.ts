import { z } from 'zod';
import { fakeyouResponse } from '../../global.schema.js';

export type ProductSchema = z.infer<typeof productSchema>;
export type ActiveSubscriptionsResponseSchema = z.infer<typeof activeSubscriptionsResponseSchema>;

export const productSchema = z.object({
	namespace: z.string(),
	product_slug: z.string()
});

export const activeSubscriptionsResponseSchema = fakeyouResponse.extend({
	maybe_loyalty_program: z.boolean({ coerce: true }),
	active_subscriptions: z.array(productSchema)
});
