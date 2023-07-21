import { expect, it, beforeEach } from 'vitest';
import Leaderboard from './Leaderboard.js';
import LeaderboardUser from './leaderboardUser/LeaderboardUser.js';
import Client from '../../index.js';

beforeEach(() => {
	Leaderboard.client = new Client();
});

it('should fetch a leaderboard tts entry with success', async () => {
	const result = await Leaderboard.fetchLeaderboard();

	expect(result.getEntry(0, 'tts')).toBeInstanceOf(LeaderboardUser);
});

it('should fetch a leaderboard w2l entry with success', async () => {
	const result = await Leaderboard.fetchLeaderboard();

	expect(result.getEntry(0, 'w2l')).toBeInstanceOf(LeaderboardUser);
});

it('should fetch leaderboards', async () => {
	const result = await Leaderboard.fetchLeaderboard();

	expect(result.ttsLeaderboard.length).toBeGreaterThan(0);
	expect(result.w2lLeaderboard.length).toBeGreaterThan(0);
});
