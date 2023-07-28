import { z } from 'zod';
import { fakeyouResponseTrue } from '../../global.schema.js';

export type CommentSchema = z.infer<typeof commentSchema>;

export const commentSchema = z.object({
	token: z.string(),
	user_token: z.string(),
	username: z.string(),
	user_display_name: z.string(),
	user_gravatar_hash: z.string(),
	default_avatar_index: z.number(),
	default_avatar_color_index: z.number(),
	comment_markdown: z.string(),
	comment_rendered_html: z.string(),
	created_at: z.date({ coerce: true }),
	updated_at: z.date({ coerce: true }),
	maybe_edited_at: z.date({ coerce: true }).nullable()
});

export const commentListResponseSchema = fakeyouResponseTrue.extend({
	comments: z.array(commentSchema)
});
