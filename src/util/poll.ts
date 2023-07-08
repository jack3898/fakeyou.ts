import { sleep } from './sleep.js';

/**
 * Run a promise over and over again until you have the right result!
 *
 * NOTE: You need to explicitly control the polling behaviour with a variant of the poll enum. `poll.Status.X`.
 * For safety reasons, this function will return the result of the callback by default if it has not been told explicitly to retry.
 */
export async function poll<T>(
	callback: () => Promise<T | PollStatus>,
	interval = 1000,
	maxTries = 120
): Promise<T | undefined> {
	let attempts = 0;

	while (attempts < maxTries) {
		attempts += 1;

		const result = await callback();

		switch (result) {
			case PollStatus.Abort:
				return;
			case PollStatus.Retry:
				await sleep(interval);
				continue;
			default:
				return result;
		}
	}

	console.error(`Max tries exceeded. The limit was ${maxTries}`);
}

export enum PollStatus {
	Retry,
	Abort
}
