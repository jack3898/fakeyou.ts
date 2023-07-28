import { z } from 'zod';
import { fakeyouResponse } from '../../global.schema.js';

export type QueueLengthResponseSchema = z.infer<typeof queueLengthResponseSchema>;

export const queueLengthResponseSchema = fakeyouResponse.extend({
	cache_time: z.date({ coerce: true }),
	refresh_interval_millis: z.number(),
	inference: z.object({
		pending_job_count: z.number()
	}),
	legacy_tts: z.object({
		pending_job_count: z.number()
	})
});
