import { log } from './index.js';
import { sleep } from './sleep.js';

/**
 * Run a promise over and over again until you have the right result. Useful for polling.
 *
 * Use the enum to tell the function to retry or abort. The function will return the result (even if it is falsy) if it is not a retry or abort variant.
 *
 * @param callback The callback to run.
 * @param interval The interval to wait between each try.
 * @param maxTries The maximum number of tries to run the callback. If this is exceeded, the function will abort.
 * @returns The result of the callback.
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

	log.error(`Max tries exceeded. The limit was ${maxTries}`);
}

export enum PollStatus {
	Retry,
	Abort
}
