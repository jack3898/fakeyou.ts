import { z } from 'zod';

export type LeaderboardUserSchema = z.infer<typeof leaderboardUserSchema>;

export const leaderboardUserSchema = z.object({
	creator_user_token: z.string(),
	username: z.string(),
	display_name: z.string(),
	gravatar_hash: z.string(),
	default_avatar_index: z.number(),
	default_avatar_color_index: z.number(),
	uploaded_count: z.number()
});
