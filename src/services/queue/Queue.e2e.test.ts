import Queue from './Queue.js';
import { it, expect } from 'vitest';

it('should fetch queue statistics', async () => {
	const queue = await Queue.fetchQueue();

	expect(queue).toBeInstanceOf(Queue);
});
