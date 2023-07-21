import type Client from '../../index.js';
import { constants, prettyParse } from '../../util/index.js';
import LeaderboardUser from './leaderboardUser/LeaderboardUser.js';
import { type LeaderboardResponseSchema, leaderboardResponseSchema } from './leaderboard.schema.js';

export default class Leaderboard {
	constructor(data: LeaderboardResponseSchema) {
		this.ttsLeaderboard = data.tts_leaderboard.map((leaderboardUser) => new LeaderboardUser(leaderboardUser));
		this.w2lLeaderboard = data.w2l_leaderboard.map((leaderboardUser) => new LeaderboardUser(leaderboardUser));
	}

	readonly ttsLeaderboard: LeaderboardUser[];
	readonly w2lLeaderboard: LeaderboardUser[];

	static client: Client;

	/**
	 * Fetch the leaderboard. This is a global leaderboard of the top contributors to the site.
	 *
	 * @returns The leaderboard
	 */
	static async fetchLeaderboard(): Promise<Leaderboard> {
		const json = await this.client.cache.wrap('fetch-leaderboard', async () => {
			const response = await this.client.rest.send(new URL(`${constants.API_URL}/leaderboard`));

			return prettyParse(leaderboardResponseSchema, await response.json());
		});

		return new this(json);
	}

	/**
	 * Get an entry from the leaderboard using its index.
	 *
	 * @param index the index of the entry. Starts at 0.
	 * @param type the type of the entry (tts or w2l).
	 * @returns the single entry.
	 */
	getEntry(index: number, type: 'tts' | 'w2l'): LeaderboardUser | undefined {
		switch (type) {
			case 'tts':
				return this.ttsLeaderboard.at(index);
			case 'w2l':
				return this.w2lLeaderboard.at(index);
		}
	}
}
