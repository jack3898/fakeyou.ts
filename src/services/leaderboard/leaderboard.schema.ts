import { z } from 'zod';
import { leaderboardUserSchema } from '../leaderboardUser/leaderboardUser.schema.js';
import { fakeyouResponse } from '../../global.schema.js';

export type LeaderboardResponseSchema = z.infer<typeof leaderboardResponseSchema>;

export const leaderboardResponseSchema = fakeyouResponse.extend({
	tts_leaderboard: z.array(leaderboardUserSchema),
	w2l_leaderboard: z.array(leaderboardUserSchema)
});
