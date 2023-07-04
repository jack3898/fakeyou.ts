import { z } from 'zod';

export type V2vModelSchema = z.infer<typeof v2vModelSchema>;
export type V2vModelListSchema = z.infer<typeof v2vModelListSchema>;
export type V2vVoiceUploadResponseSchema = z.infer<typeof v2vVoiceUploadResponseSchema>;

export const v2vModelSchema = z.object({
	token: z.string(),
	model_type: z.string(),
	title: z.string(),
	creator: z.object({
		user_token: z.string(),
		username: z.string(),
		display_name: z.string(),
		gravatar_hash: z.string()
	}),
	creator_set_visibility: z.union([z.literal('public'), z.literal('hidden')]),
	ietf_language_tag: z.string(),
	ietf_primary_language_subtag: z.string(),
	is_front_page_featured: z.boolean(),
	created_at: z.date({ coerce: true }),
	updated_at: z.date({ coerce: true })
});

export const v2vModelListSchema = z.object({
	success: z.boolean(),
	models: z.array(v2vModelSchema)
});

export const v2vVoiceUploadResponseSchema = z.object({
	success: z.boolean(),
	upload_token: z.string()
});
