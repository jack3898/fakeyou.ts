import { z } from 'zod';
import { fakeyouResponseTrue, visibilitySchema } from '../../global.schema.js';

export type TtsResultSchema = z.infer<typeof ttsResultSchema>;
export type TtsResultResponseSchema = z.infer<typeof ttsResultResponseSchema>;

export const ttsResultSchema = z.object({
	tts_result_token: z.string(),
	raw_inference_text: z.string(),
	tts_model_token: z.string(),
	tts_model_title: z.string(),
	maybe_pretrained_vocoder_used: z.string().nullable(),
	maybe_creator_user_token: z.string().nullable(),
	maybe_creator_username: z.string().nullable(),
	maybe_creator_display_name: z.string().nullable(),
	maybe_creator_gravatar_hash: z.string().nullable(),
	maybe_model_creator_user_token: z.string().nullable(),
	maybe_model_creator_username: z.string().nullable(),
	maybe_model_creator_display_name: z.string().nullable(),
	maybe_model_creator_gravatar_hash: z.string().nullable(),
	public_bucket_wav_audio_path: z.string(),
	public_bucket_spectrogram_path: z.string(),
	creator_set_visibility: visibilitySchema,
	generated_by_worker: z.string(),
	is_debug_request: z.boolean(),
	file_size_bytes: z.number(),
	duration_millis: z.number(),
	created_at: z.date({ coerce: true }),
	updated_at: z.date({ coerce: true })
});

export const ttsResultResponseSchema = fakeyouResponseTrue.extend({
	result: ttsResultSchema
});
