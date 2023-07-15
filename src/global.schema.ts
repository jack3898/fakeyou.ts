import { z } from 'zod';

export const visibilitySchema = z.enum(['public', 'hidden']);

export const fakeyouResponse = z.object({
	success: z.boolean()
});

export const fakeyouResponseFalse = z.object({
	success: z.literal(false)
});

export const fakeyouResponseTrue = z.object({
	success: z.literal(true)
});
