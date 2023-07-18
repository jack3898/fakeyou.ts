import { z } from 'zod';
import { fakeyouResponse, fakeyouResponseFalse, fakeyouResponseTrue } from '../../global.schema.js';

export type TtsModelSchema = z.infer<typeof ttsModelSchema>;
export type TtsModelListSchema = z.infer<typeof ttsModelListSchema>;
export type TtsInferenceSchema = z.infer<typeof ttsInferenceSchema>;
export type TtsInferenceRateLimitSchema = z.infer<typeof ttsInferenceErrorSchema>;
export type TtsInferenceResultSchema = z.infer<typeof ttsInferenceResultSchema>;
export type TtsInferenceStatusDoneSchema = z.infer<typeof ttsInferenceStatusDoneSchema>;
export type TtsInferenceStatusSchema = z.infer<typeof ttsInferenceStatusSchema>;
export type TtsRequestStatusResponseSchema = z.infer<typeof ttsRequestStatusResponseSchema>;
export type RatingSchema = z.infer<typeof ratingSchema>;
export type UserRatingResponseSchema = z.infer<typeof userRatingResponseSchema>;

export const ttsModelSchema = z.object({
	model_token: z.string(),
	tts_model_type: z.string(),
	creator_user_token: z.string(),
	creator_username: z.string(),
	creator_display_name: z.string(),
	creator_gravatar_hash: z.string(),
	title: z.string(),
	ietf_language_tag: z.string(),
	ietf_primary_language_subtag: z.string(),
	is_front_page_featured: z.boolean(),
	is_twitch_featured: z.boolean(),
	maybe_suggested_unique_bot_command: z.string().nullable(),
	category_tokens: z
		.array(z.string())
		.nullish()
		.transform((x) => x ?? null),
	created_at: z.date({ coerce: true }),
	updated_at: z.date({ coerce: true })
});

export const ttsModelListSchema = fakeyouResponse.extend({
	models: z.array(ttsModelSchema)
});

export const ttsInferenceSchema = fakeyouResponseTrue.extend({
	inference_job_token: z.string()
});

export const ttsInferenceErrorSchema = fakeyouResponseFalse.extend({
	error_reason: z.string()
});

export const ttsInferenceResultSchema = z.union([ttsInferenceSchema, ttsInferenceErrorSchema]);

export const ttsInferenceStatusDoneSchema = z.object({
	job_token: z.string(),
	status: z.literal('complete_success'),
	maybe_extra_status_description: z.union([z.literal('done'), z.null()]),
	attempt_count: z.number(),
	maybe_result_token: z.string(),
	maybe_public_bucket_wav_audio_path: z.string(),
	model_token: z.string(),
	tts_model_type: z.string(),
	title: z.string(),
	raw_inference_text: z.string(),
	created_at: z.date({ coerce: true }),
	updated_at: z.date({ coerce: true })
});

export const ttsInferenceStatusSchema = z.object({
	status: z.enum(['pending', 'started', 'complete_failure', 'attempt_failed', 'dead']),
	maybe_extra_status_description: z.null(),
	attempt_count: z.number(),
	maybe_result_token: z.null(),
	maybe_public_bucket_wav_audio_path: z.null(),
	model_token: z.string(),
	tts_model_type: z.string(),
	title: z.string(),
	raw_inference_text: z.string(),
	created_at: z.date({ coerce: true }),
	updated_at: z.date({ coerce: true })
});

export const ttsRequestStatusResponseSchema = fakeyouResponse.extend({
	state: z.union([ttsInferenceStatusSchema, ttsInferenceStatusDoneSchema])
});

export const ratingSchema = z.enum(['positive', 'negative', 'neutral']);

export const userRatingResponseSchema = fakeyouResponse.extend({
	maybe_rating_value: ratingSchema
});
