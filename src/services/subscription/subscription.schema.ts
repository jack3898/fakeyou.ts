import { z } from 'zod';
import { productSchema } from '../product/product.schema.js';

export type ActiveSubscriptionsResponseSchema = z.infer<typeof activeSubscriptionsResponseSchema>;

export const activeSubscriptionsResponseSchema = z.object({
	success: z.boolean(),
	maybe_loyalty_program: z.boolean({ coerce: true }),
	active_subscriptions: z.array(productSchema)
});
