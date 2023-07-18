import { z } from 'zod';
import { fakeyouResponse } from '../../global.schema.js';

export type SessionUserSchema = z.infer<typeof sessionUserSchema>;
export type SessionUserResponseSchema = z.infer<typeof sessionUserResponseSchema>;
export type LoggedInUserProfileResponseSchema = z.infer<typeof loggedInUserProfileResponseSchema>;

export const sessionUserSchema = z.object({
	user_token: z.string(),
	username: z.string(),
	display_name: z.string(),
	email_gravatar_hash: z.string(),
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

export const sessionUserResponseSchema = fakeyouResponse.extend({
	user: sessionUserSchema
});

export const loggedInUserProfileResponseSchema = z.union([
	fakeyouResponse.extend({
		logged_in: z.literal(true),
		user: sessionUserSchema
	}),
	fakeyouResponse.extend({
		logged_in: z.literal(false),
		user: z.null()
	})
]);
