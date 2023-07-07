import { z } from 'zod';
import { userBadgeSchema } from '../badge/badge.schema.js';
import { fakeyouResponse, visibilitySchema } from '../../global.schema.js';

export type UserProfileSchema = z.infer<typeof userProfileSchema>;
export type UserProfileResponseSchema = z.infer<typeof userProfileResponseSchema>;
export type EditUserProfileInputSchema = z.infer<typeof editUserProfileInputSchema>;

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
	preferred_tts_result_visibility: visibilitySchema,
	preferred_w2l_result_visibility: visibilitySchema,
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

export const userProfileResponseSchema = fakeyouResponse.extend({
	user: userProfileSchema
});

export const editUserProfileInputSchema = z.object({
	cashapp_username: z.string(),
	discord_username: z.string(),
	github_username: z.string(),
	preferred_tts_result_visibility: visibilitySchema,
	preferred_w2l_result_visibility: visibilitySchema,
	profile_markdown: z.string(),
	twitch_username: z.string(),
	twitter_username: z.string(),
	website_url: z.string()
});

export const editUserProfileResponseSchema = fakeyouResponse;
