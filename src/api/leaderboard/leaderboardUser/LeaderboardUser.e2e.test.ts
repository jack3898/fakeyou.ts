import { expect, it } from 'vitest';
import { Client } from '../../../services/client/Client.js';
import { LeaderboardUser } from './LeaderboardUser.js';

const client = new Client();

it('should fetch a tts leaderboard user', async () => {
	const result = await client.fetchLeaderboard();
	const user = result.getEntry(0, 'tts');

	expect(user).toBeInstanceOf(LeaderboardUser);
});

it('should fetch a w2l leaderboard user', async () => {
	const result = await client.fetchLeaderboard();
	const user = result.getEntry(0, 'w2l');

	expect(user).toBeInstanceOf(LeaderboardUser);
});

it('should return unefined if the entry is not found', async () => {
	const result = await client.fetchLeaderboard();
	const user = result.getEntry(100000, 'w2l');

	expect(user).toBeUndefined();
});
