import { cache, constants, prettyParse, request } from '../../util/index.js';
import LeaderboardUser from '../leaderboardUser/LeaderboardUser.js';
import { type LeaderboardUserSchema } from '../leaderboardUser/leaderboardUser.schema.js';
import { type LeaderboardResponseSchema, leaderboardResponseSchema } from './leaderboard.schema.js';

export default class Leaderboard {
	constructor(data: LeaderboardResponseSchema) {
		this.#ttsLeaderboardData = data.tts_leaderboard;
		this.#w2lLeaderboardData = data.w2l_leaderboard;
	}

	#ttsLeaderboardData: LeaderboardUserSchema[];

	#w2lLeaderboardData: LeaderboardUserSchema[];

	static async fetchLeaderboard(): Promise<Leaderboard> {
		const json = await cache.wrap('fetch-leaderboard', async () => {
			const response = await request.send(new URL(`${constants.API_URL}/leaderboard`));

			return prettyParse(leaderboardResponseSchema, await response.json());
		});

		return new this(json);
	}

	get ttsLeaderboard(): LeaderboardUser[] {
		return this.#ttsLeaderboardData.map((leaderboardUser) => new LeaderboardUser(leaderboardUser));
	}

	get w2lLeaderboard(): LeaderboardUser[] {
		return this.#w2lLeaderboardData.map((leaderboardUser) => new LeaderboardUser(leaderboardUser));
	}

	getEntry(index: number, type: 'tts' | 'w2l'): LeaderboardUser | undefined {
		switch (type) {
			case 'tts':
				return this.#ttsLeaderboardData.at(index) && new LeaderboardUser(this.#ttsLeaderboardData[index]);
			case 'w2l':
				return this.#w2lLeaderboardData.at(index) && new LeaderboardUser(this.#w2lLeaderboardData[index]);
		}
	}
}
