import { z } from 'zod';

export const visibilitySchema = z.union([z.literal('public'), z.literal('hidden')]);

export const fakeyouResponse = z.object({
	success: z.boolean()
});

export const fakeyouResponseFalse = z.object({
	success: z.literal(false)
});

export const fakeyouResponseTrue = z.object({
	success: z.literal(true)
});
