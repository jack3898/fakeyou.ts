/**
 * Promise wrapper over setTimeout. Useful for pausing an asynchronous operation for that time.
 *
 * @param ms The time to sleep in milliseconds.
 * @returns A promise that resolves when the time has passed.
 * @example await sleep(1000);
 */
export function sleep(ms: number): Promise<void> {
	return new Promise<void>((res) => {
		setTimeout(() => {
			res();
		}, ms);
	});
}
