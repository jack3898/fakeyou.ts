import { apiUrl } from '../util/constants.js';
import {
	leaderboardResponseSchema,
	type LeaderboardResponseSchema,
	type LeaderboardUserSchema
} from '../util/validation.js';
import Cache from './Cache.js';
import LeaderboardUser from './LeaderboardUser.js';
import Rest from './Rest.js';

export default class Leaderboard {
	constructor(data: LeaderboardResponseSchema) {
		this.#ttsLeaderboardData = data.tts_leaderboard;
		this.#w2lLeaderboardData = data.w2l_leaderboard;
	}

	#ttsLeaderboardData: LeaderboardUserSchema[];

	#w2lLeaderboardData: LeaderboardUserSchema[];

	static async fetchLeaderboard() {
		const json = await Cache.wrap('fetch-leaderboard', async () => {
			const response = await Rest.fetch(new URL(`${apiUrl}/leaderboard`), { method: 'GET' });
			return leaderboardResponseSchema.parse(await response.json());
		});

		return new this(json);
	}

	get data() {
		return {
			tts: this.#ttsLeaderboardData,
			w2l: this.#w2lLeaderboardData
		};
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
			default:
				return undefined;
		}
	}
}
