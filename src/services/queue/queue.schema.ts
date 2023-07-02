import { z } from 'zod';

export type QueueLengthResponseSchema = z.infer<typeof queueLengthResponseSchema>;

export const queueLengthResponseSchema = z.object({
	success: z.boolean(),
	pending_job_count: z.number(),
	cache_time: z.date({ coerce: true }),
	refresh_interval_millis: z.number()
});
