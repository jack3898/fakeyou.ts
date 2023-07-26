import { expect, it } from 'vitest';
import { Client } from '../../../services/client/Client.js';

it('should fetch user models with success and paginate', async () => {
	const client = new Client();
	const user = await client.fetchUserProfile('jackwright3898');

	const result = await user?.fetchUserAudioFiles();

	expect(result?.results.length).toBeGreaterThan(0);

	const nextPage = await user?.fetchUserAudioFiles(result?.cursorNext as string);

	expect(nextPage?.results.length).toBeGreaterThan(0);

	const prevPage = await user?.fetchUserAudioFiles(nextPage?.cursorPrev as string);

	expect(prevPage?.results.length).toBeGreaterThan(0);
});

it('should return no results if no user models could be found', async () => {
	const client = new Client();
	const user = await client.fetchUserProfile('jackwright3898');

	expect(user).not.toBeUndefined();

	const result = await user?.fetchUserAudioFiles(crypto.randomUUID());

	expect(result?.results).toStrictEqual(undefined);
});
