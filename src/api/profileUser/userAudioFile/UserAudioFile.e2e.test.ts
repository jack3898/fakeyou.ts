import { it, expect } from 'vitest';
import Client from '../../../services/client/Client.js';

const client = new Client();

it('should fetch user models with success and paginate', async () => {
	const result = await client.userTtsAudioHistory.fetchUserAudioFiles('jackwright3898');

	expect(result?.results.length).toBeGreaterThan(0);

	const nextPage = await client.userTtsAudioHistory.fetchUserAudioFiles('jackwright3898', result?.cursorNext as string);

	expect(nextPage?.results.length).toBeGreaterThan(0);

	const prevPage = await client.userTtsAudioHistory.fetchUserAudioFiles('jackwright3898', nextPage?.cursorPrev as string);

	expect(prevPage?.results.length).toBeGreaterThan(0);
});

it('should return no results if no user models could be found', async () => {
	const result = await client.userTtsAudioHistory.fetchUserAudioFiles(crypto.randomUUID());

	expect(result?.results).toStrictEqual([]);
});
