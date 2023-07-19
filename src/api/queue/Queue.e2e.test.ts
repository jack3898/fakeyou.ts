import Client from '../../index.js';
import Queue from './Queue.js';
import { it, expect, beforeEach } from 'vitest';

beforeEach(() => {
	Queue.client = new Client();
});

it('should fetch queue statistics', async () => {
	const queue = await Queue.fetchQueue();

	expect(queue).toBeInstanceOf(Queue);
});
