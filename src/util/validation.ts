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

export const credentialsSchema = z.object({
	username: z.string(),
	password: z.string()
});

export type CredentialsSchema = z.infer<typeof credentialsSchema>;

export const loginSchema = z.object({
	success: z.boolean()
});

export type LoginSchema = z.infer<typeof loginSchema>;

//////////

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
	category_tokens: z.array(z.string()),
	created_at: z.date({ coerce: true }),
	updated_at: z.date({ coerce: true })
});

export type TtsModelSchema = z.infer<typeof ttsModelSchema>;

export const ttsModelListSchema = z.object({
	success: z.boolean(),
	models: z.array(ttsModelSchema)
});

export type TtsModelListSchema = z.infer<typeof ttsModelListSchema>;

//////////

export const ttsInferenceSchena = z.object({
	success: z.boolean(),
	inference_job_token: z.string()
});

export type TtsInferenceSchema = z.infer<typeof ttsInferenceSchena>;

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

export type TtsInferenceStatusDoneSchema = z.infer<typeof ttsInferenceStatusDoneSchema>;

export const ttsInferenceStatusSchema = z.object({
	status: z.union([
		z.literal('pending'),
		z.literal('attempt_failed'),
		z.literal('complete'),
		z.literal('failed'),
		z.literal('dead'),
		z.literal('started')
	]),
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

export type TtsInferenceStatusSchema = z.infer<typeof ttsInferenceStatusSchema>;

export const ttsRequestStatusResponseSchema = z.object({
	success: z.boolean(),
	state: z.union([ttsInferenceStatusSchema, ttsInferenceStatusDoneSchema])
});

export type TtsRequestStatusResponseSchema = z.infer<typeof ttsRequestStatusResponseSchema>;

//////////

export const sessionUserSchema = z.object({
	user_token: z.string(),
	username: z.string(),
	display_name: z.string(),
	email_gravatar_hash: z.string(),
	fakeyou_plan: z.string(),
	storyteller_stream_plan: z.string(),
	can_use_tts: z.boolean(),
	can_use_w2l: z.boolean(),
	can_delete_own_tts_results: z.boolean(),
	can_delete_own_w2l_results: z.boolean(),
	can_delete_own_account: z.boolean(),
	can_upload_tts_models: z.boolean(),
	can_upload_w2l_templates: z.boolean(),
	can_delete_own_tts_models: z.boolean(),
	can_delete_own_w2l_templates: z.boolean(),
	can_approve_w2l_templates: z.boolean(),
	can_edit_other_users_profiles: z.boolean(),
	can_edit_other_users_tts_models: z.boolean(),
	can_edit_other_users_w2l_templates: z.boolean(),
	can_delete_other_users_tts_models: z.boolean(),
	can_delete_other_users_tts_results: z.boolean(),
	can_delete_other_users_w2l_templates: z.boolean(),
	can_delete_other_users_w2l_results: z.boolean(),
	can_ban_users: z.boolean(),
	can_delete_users: z.boolean()
});

export type SessionUserSchema = z.infer<typeof sessionUserSchema>;

export const sessionUserResponseSchema = z.object({
	success: z.boolean(),
	user: sessionUserSchema
});

export type SessionUserResponseSchema = z.infer<typeof sessionUserResponseSchema>;

export const loggedInUserProfileResponseSchema = z.union([
	z.object({
		success: z.boolean(),
		logged_in: z.literal(true),
		user: sessionUserSchema
	}),
	z.object({
		success: z.boolean(),
		logged_in: z.literal(false),
		user: z.null()
	})
]);

export type LoggedInUserProfileResponseSchema = z.infer<typeof loggedInUserProfileResponseSchema>;

//////////

export const leaderboardUserSchema = z.object({
	creator_user_token: z.string(),
	username: z.string(),
	display_name: z.string(),
	gravatar_hash: z.string(),
	default_avatar_index: z.number(),
	default_avatar_color_index: z.number(),
	uploaded_count: z.number()
});

export type LeaderboardUserSchema = z.infer<typeof leaderboardUserSchema>;

export const leaderboardResponseSchema = z.object({
	success: z.boolean(),
	tts_leaderboard: z.array(leaderboardUserSchema),
	w2l_leaderboard: z.array(leaderboardUserSchema)
});

export type LeaderboardResponseSchema = z.infer<typeof leaderboardResponseSchema>;
