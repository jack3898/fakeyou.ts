import { z } from 'zod';

export type ProductSchema = z.infer<typeof productSchema>;

export const productSchema = z.object({
	namespace: z.string(),
	product_slug: z.string()
});
