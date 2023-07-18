import { z } from 'zod';

export type UserBadgeSchema = z.infer<typeof userBadgeSchema>;

export const userBadgeSchema = z.object({
	slug: z.string(),
	title: z.string(),
	description: z.string(),
	image_url: z.string(),
	granted_at: z.date({ coerce: true })
});
