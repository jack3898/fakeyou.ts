import { it, expect, beforeEach } from 'vitest';
import UserAudioFile from './UserAudioFile.js';
import Client from '../../index.js';

beforeEach(() => {
	UserAudioFile.client = new Client();
});

it('should fetch user models with success and paginate', async () => {
	const result = await UserAudioFile.fetchUserAudioFiles('jackwright3898');

	expect(result?.results.length).toBeGreaterThan(0);

	const nextPage = await UserAudioFile.fetchUserAudioFiles('jackwright3898', result?.cursorNext as string);

	expect(nextPage?.results.length).toBeGreaterThan(0);

	const prevPage = await UserAudioFile.fetchUserAudioFiles('jackwright3898', nextPage?.cursorPrev as string);

	expect(prevPage?.results.length).toBeGreaterThan(0);
});

it('should return no results if no user models could be found', async () => {
	const result = await UserAudioFile.fetchUserAudioFiles(crypto.randomUUID());

	console.log(result);

	expect(result?.results).toStrictEqual([]);
});
