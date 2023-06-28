import { z } from 'zod';

/**
 * Validation schemas.
 *
 * Responses from the api are processed and validated with Zod.
 *
 * Please see below official FakeYou documentation to learn more.
 *
 * @see https://docs.fakeyou.com/#/
 */

//////////

export const requiredLogin = z.object({
	username: z.string(),
	password: z.string()
});

export type RequiredLogin = z.infer<typeof requiredLogin>;

export const optionalLogin = requiredLogin.optional();

export type OptionalLogin = z.infer<typeof optionalLogin>;

export const loginResponse = z.object({
	success: z.boolean()
});

export type LoginResponse = z.infer<typeof loginResponse>;

//////////

export const ttsModel = z.object({
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
	category_tokens: z.array(z.string()),
	created_at: z.date({ coerce: true }),
	updated_at: z.date({ coerce: true })
});

export type TtsModel = z.infer<typeof ttsModel>;

export const ttsListVoiceResponse = z.object({
	success: z.boolean(),
	models: z.array(ttsModel)
});

export type TtsListVoiceResponse = z.infer<typeof ttsListVoiceResponse>;

//////////

export const ttsInferenceResponse = z.object({
	success: z.boolean(),
	inference_job_token: z.string()
});

export type ttsInferenceResponse = z.infer<typeof ttsInferenceResponse>;

export const ttsRequestStatusDoneResponse = z.object({
	job_token: z.string(),
	status: z.literal('complete_success'),
	maybe_extra_status_description: z.union([z.literal('done'), z.literal(null)]),
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

export type TtsRequestStatusDoneResponse = z.infer<typeof ttsRequestStatusDoneResponse>;

export const ttsRequestStatusPendingResponse = z.object({
	status: z.union([
		z.literal('pending'),
		z.literal('attempt_failed'),
		z.literal('complete'),
		z.literal('failed'),
		z.literal('dead'),
		z.literal('started')
	]),
	maybe_extra_status_description: z.literal(null),
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

export type TtsRequestStatusPendingResponse = z.infer<typeof ttsRequestStatusPendingResponse>;

export const ttsRequestStatusResponse = z.object({
	success: z.boolean(),
	state: z.union([ttsRequestStatusPendingResponse, ttsRequestStatusDoneResponse])
});

export type TtsRequestStatusResponse = z.infer<typeof ttsRequestStatusResponse>;
