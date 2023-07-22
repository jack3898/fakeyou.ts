import { expect, it } from 'vitest';
import { PollStatus, poll } from './poll.js';

it('should forward return value when not poll status enum', async () => {
	const result = await poll(async () => {
		return 'value';
	}, 0);

	expect(result).toBe('value');
});

it('should retry on retry enum', async () => {
	let testData = 0;

	const result = await poll(async () => {
		testData++;

		if (testData < 3) {
			return PollStatus.Retry;
		}

		return testData;
	}, 0);

	expect(result).toBe(3);
});

it('should abort on abort enum', async () => {
	let testData = 0;

	const result = await poll(async () => {
		if (testData >= 3) {
			return PollStatus.Abort;
		}

		testData++;

		return PollStatus.Retry;
	}, 0);

	expect(result).not.toBeDefined();
	expect(testData).toBe(3);
});

it('should not return a value on max retries exceeded', async () => {
	const result = await poll(async () => PollStatus.Retry, 0, 3);

	expect(result).not.toBeDefined();
});
