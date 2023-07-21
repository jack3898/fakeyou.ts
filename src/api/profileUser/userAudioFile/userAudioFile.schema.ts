import { z } from 'zod';
import { fakeyouResponse, visibilitySchema } from '../../../global.schema.js';

export type UserTtsSchema = z.infer<typeof userTtsSchema>;
export type UserTtsListResponseSchema = z.infer<typeof userTtsListResponseSchema>;

export const userTtsSchema = z.object({
	tts_result_token: z.string(),
	tts_model_token: z.string(),
	tts_model_title: z.string(),
	raw_inference_text: z.string(),
	public_bucket_wav_audio_path: z.string(),
	maybe_creator_user_token: z.string(),
	maybe_creator_username: z.string(),
	maybe_creator_display_name: z.string(),
	maybe_creator_result_id: z.number(),
	file_size_bytes: z.number(),
	duration_millis: z.number(),
	visibility: visibilitySchema,
	created_at: z.date({ coerce: true }),
	updated_at: z.date({ coerce: true })
});

export const userTtsListResponseSchema = fakeyouResponse.extend({
	results: z.array(userTtsSchema),
	cursor_next: z.string().nullable(),
	cursor_previous: z.string().nullable()
});
