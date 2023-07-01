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
		z.literal('started'),
		z.literal('complete_failure'),
		z.literal('attempt_failed'),
		z.literal('dead')
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

//////////

export const userBadgeSchema = z.object({
	slug: z.string(),
	title: z.string(),
	description: z.string(),
	image_url: z.string(),
	granted_at: z.date({ coerce: true })
});

export type UserBadgeSchema = z.infer<typeof userBadgeSchema>;

export const userProfileSchema = z.object({
	user_token: z.string(),
	username: z.string(),
	display_name: z.string(),
	email_gravatar_hash: z.string(),
	default_avatar_index: z.number(),
	default_avatar_color_index: z.number(),
	profile_markdown: z.string(),
	profile_rendered_html: z.string(),
	user_role_slug: z.string(),
	disable_gravatar: z.boolean(),
	preferred_tts_result_visibility: z.union([z.literal('hidden'), z.literal('public')]),
	preferred_w2l_result_visibility: z.union([z.literal('hidden'), z.literal('public')]),
	discord_username: z.string().nullable(),
	twitch_username: z.string().nullable(),
	twitter_username: z.string().nullable(),
	patreon_username: z.string().nullable(),
	github_username: z.string().nullable(),
	cashapp_username: z.string().nullable(),
	website_url: z.string().nullable(),
	badges: z.array(userBadgeSchema),
	created_at: z.date({ coerce: true }),
	maybe_moderator_fields: z.string().nullable()
});

export type UserProfileSchema = z.infer<typeof userProfileSchema>;

export const userProfileResponseSchema = z.object({
	success: z.boolean(),
	user: userProfileSchema
});

export type UserProfileResponseSchema = z.infer<typeof userProfileResponseSchema>;

//////////

export const categorySchema = z.object({
	category_token: z.string(),
	maybe_super_category_token: z.string().nullable(),
	model_type: z.string(),
	name: z.string(),
	name_for_dropdown: z.string(),
	can_directly_have_models: z.boolean(),
	can_have_subcategories: z.boolean(),
	can_only_mods_apply: z.boolean(),
	is_mod_approved: z.boolean().nullable(),
	is_synthetic: z.boolean(),
	should_be_sorted: z.boolean(),
	created_at: z.date({ coerce: true }),
	updated_at: z.date({ coerce: true }),
	deleted_at: z.date({ coerce: true }).nullable()
});

export type CategorySchema = z.infer<typeof categorySchema>;

export const categoryListResponseSchema = z.object({
	success: z.boolean(),
	categories: z.array(categorySchema)
});

export type CategoryListResponseSchema = z.infer<typeof categoryListResponseSchema>;

export const categoryToModelSchema = z.object({
	success: z.boolean(),
	category_token_to_tts_model_tokens: z.object({
		recursive: z.record(z.string(), z.array(z.string()))
	})
});

export type categoryToModelSchema = z.infer<typeof categoryToModelSchema>;

//////////

export const queueLengthResponseSchema = z.object({
	success: z.boolean(),
	pending_job_count: z.number(),
	cache_time: z.date({ coerce: true }),
	refresh_interval_millis: z.number()
});

export type QueueLengthResponseSchema = z.infer<typeof queueLengthResponseSchema>;

//////////

export const productSchema = z.object({
	namespace: z.string(),
	product_slug: z.string()
});

export type ProductSchema = z.infer<typeof productSchema>;

export const activeSubscriptionsResponseSchema = z.object({
	success: z.boolean(),
	maybe_loyalty_program: z.boolean({ coerce: true }),
	active_subscriptions: z.array(productSchema)
});

export type ActiveSubscriptionsResponseSchema = z.infer<typeof activeSubscriptionsResponseSchema>;
