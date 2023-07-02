import { z } from 'zod';
import { leaderboardUserSchema } from '../leaderboardUser/leaderboardUser.schema.js';

export type LeaderboardResponseSchema = z.infer<typeof leaderboardResponseSchema>;

export const leaderboardResponseSchema = z.object({
	success: z.boolean(),
	tts_leaderboard: z.array(leaderboardUserSchema),
	w2l_leaderboard: z.array(leaderboardUserSchema)
});
