import { expect, it } from 'vitest';
import Client from '../../index.js';
import { TtsResult } from './TtsResult.js';

const client = new Client();

it('should fetch a tts result', async () => {
	const ttsResult = await client.fetchTtsResultByToken('TR:js1hnnhbs99n6gzk98tw86fdhhb9j');

	expect(ttsResult).toBeInstanceOf(TtsResult);
});

it("should return undefined if the tts result doesn't exist", async () => {
	const ttsResult = await client.fetchTtsResultByToken('bad');

	expect(ttsResult).toBeUndefined();
});
