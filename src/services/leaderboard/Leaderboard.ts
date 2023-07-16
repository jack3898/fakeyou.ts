import { cache, constants, prettyParse, request } from '../../util/index.js';
import LeaderboardUser from '../leaderboardUser/LeaderboardUser.js';
import { type LeaderboardResponseSchema, leaderboardResponseSchema } from './leaderboard.schema.js';

export default class Leaderboard {
	constructor(data: LeaderboardResponseSchema) {
		this.ttsLeaderboard = data.tts_leaderboard.map((leaderboardUser) => new LeaderboardUser(leaderboardUser));
		this.w2lLeaderboard = data.w2l_leaderboard.map((leaderboardUser) => new LeaderboardUser(leaderboardUser));
	}

	readonly ttsLeaderboard: LeaderboardUser[];
	readonly w2lLeaderboard: LeaderboardUser[];

	static async fetchLeaderboard(): Promise<Leaderboard> {
		const json = await cache.wrap('fetch-leaderboard', async () => {
			const response = await request.send(new URL(`${constants.API_URL}/leaderboard`));

			return prettyParse(leaderboardResponseSchema, await response.json());
		});

		return new this(json);
	}

	getEntry(index: number, type: 'tts' | 'w2l'): LeaderboardUser | undefined {
		switch (type) {
			case 'tts':
				return this.ttsLeaderboard.at(index);
			case 'w2l':
				return this.w2lLeaderboard.at(index);
		}
	}
}
