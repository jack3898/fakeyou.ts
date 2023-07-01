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
