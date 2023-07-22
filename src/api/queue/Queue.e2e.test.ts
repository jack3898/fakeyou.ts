import { expect, it } from 'vitest';
import Client from '../../index.js';
import Queue from './Queue.js';

const client = new Client();

it('should fetch queue statistics', async () => {
	const queue = await client.fetchQueue();

	expect(queue).toBeInstanceOf(Queue);
});
