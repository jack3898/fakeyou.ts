/**
 * Promise wrapper over setTimeout. Useful for pausing an asynchronous operation for that time.
 */
export function sleep(ms: number): Promise<void> {
	return new Promise<void>((res) => {
		setTimeout(() => {
			res();
		}, ms);
	});
}

/**
 * Run a promise over and over again until the result is truthy.
 */
export async function poll<T>(callback: () => Promise<T | PollStatus>, interval = 1000, maxTries = 60): Promise<T | null> {
	let attempts = 0;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		try {
			if (attempts >= maxTries) {
				throw Error(`Too many poll attempts. ${attempts} attempts have been made.`);
			}

			attempts += 1;

			const result = await callback();

			switch (result) {
				case PollStatus.Abort:
					return null;
				case PollStatus.Retry:
					await sleep(interval);
					continue;
				default:
					return result;
			}
		} catch (error: unknown) {
			console.error('Poll attempt threw an error.', error);

			return null;
		}
	}
}

enum PollStatus {
	Retry,
	Abort
}

poll.Status = PollStatus;
