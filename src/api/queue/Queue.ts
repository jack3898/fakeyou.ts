import { type QueueLengthResponseSchema } from './queue.schema.js';

export default class Queue {
	constructor(data: QueueLengthResponseSchema) {
		this.pendingJobCount = data.pending_job_count;
		this.cacheTime = data.cache_time;
		this.refreshIntervalMillis = data.refresh_interval_millis;
	}

	readonly pendingJobCount: number;
	readonly cacheTime: Date;
	readonly refreshIntervalMillis: number;
}
