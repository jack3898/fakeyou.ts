import { Client } from '../../index.js';
import { type LeaderboardResponseSchema } from './leaderboard.schema.js';
import LeaderboardUser from './leaderboardUser/LeaderboardUser.js';

export default class Leaderboard {
	constructor(client: Client, data: LeaderboardResponseSchema) {
		this.ttsLeaderboard = data.tts_leaderboard.map((leaderboardUser) => new LeaderboardUser(client, leaderboardUser));
		this.w2lLeaderboard = data.w2l_leaderboard.map((leaderboardUser) => new LeaderboardUser(client, leaderboardUser));
	}

	readonly ttsLeaderboard: LeaderboardUser[];
	readonly w2lLeaderboard: LeaderboardUser[];

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
