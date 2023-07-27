import { expect, it } from 'vitest';
import Client from '../../index.js';
import { LeaderboardUser } from './leaderboardUser/LeaderboardUser.js';

const client = new Client();

it('should fetch a leaderboard tts entry with success', async () => {
	const result = await client.fetchLeaderboard();

	expect(result.getEntry(0, 'tts')).toBeInstanceOf(LeaderboardUser);
});

it('should fetch a leaderboard w2l entry with success', async () => {
	const result = await client.fetchLeaderboard();

	expect(result.getEntry(0, 'w2l')).toBeInstanceOf(LeaderboardUser);
});

it('should fetch leaderboards', async () => {
	const result = await client.fetchLeaderboard();

	expect(result.ttsLeaderboard.length).toBeGreaterThan(0);
	expect(result.w2lLeaderboard.length).toBeGreaterThan(0);
});
