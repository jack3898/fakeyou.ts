import { type QueueLengthResponseSchema } from './queue.schema.js';

/**
 * The queue length and refresh interval.
 * The queue length is the number of jobs that are currently pending.
 */
export class Queue {
	/**
	 * @param data The raw queue data from the FakeYou API.
	 */
	constructor(data: QueueLengthResponseSchema) {
		this.pendingJobCount = data.pending_job_count;
		this.cacheTime = data.cache_time;
		this.refreshIntervalMillis = data.refresh_interval_millis;
	}

	/**
	 * The number of jobs that are currently pending.
	 * The bigger this number is, the longer it will take for your job to be processed.
	 * If this number is above 2000 then your request may take multiple minutes.
	 * If this number is below 100 then your request will come through momentarily.
	 */
	readonly pendingJobCount: number;
	readonly cacheTime: Date;
	readonly refreshIntervalMillis: number;
}
