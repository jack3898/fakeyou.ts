import Client from '../../index.js';
import Queue from './Queue.js';
import { it, expect } from 'vitest';

const client = new Client();

it('should fetch queue statistics', async () => {
	const queue = await client.queue.fetchQueue();

	expect(queue).toBeInstanceOf(Queue);
});
