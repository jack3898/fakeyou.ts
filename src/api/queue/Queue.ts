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
		this.ttsQueued = data.legacy_tts.pending_job_count;
		this.v2vQueued = data.inference.pending_job_count;
		this.cacheTime = data.cache_time;
		this.refreshIntervalMillis = data.refresh_interval_millis;
	}

	/**
	 * The number of jobs that are currently pending.
	 * The bigger this number is, the longer it will take for your job to be processed.
	 */
	readonly ttsQueued: number;
	/**
	 * The number of jobs that are currently pending for the voice to voice.
	 * The bigger this number is, the longer it will take for your job to be processed.
	 */
	readonly v2vQueued: number;
	readonly cacheTime: Date;
	readonly refreshIntervalMillis: number;
}
