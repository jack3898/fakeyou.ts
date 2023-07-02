import { apiUrl } from '../util/constants.js';
import { request } from '../util/request.js';
import { queueLengthResponseSchema, type QueueLengthResponseSchema } from '../util/validation.js';

export default class Queue {
	constructor(data: QueueLengthResponseSchema) {
		this.pendingJobCount = data.pending_job_count;
		this.cacheTime = data.cache_time;
		this.refreshIntervalMillis = data.refresh_interval_millis;
	}

	readonly pendingJobCount: number;

	readonly cacheTime: Date;

	readonly refreshIntervalMillis: number;

	static async fetchQueue(): Promise<Queue> {
		const response = await request(new URL(`${apiUrl}/tts/queue_length`), { method: 'GET' });
		const json = queueLengthResponseSchema.parse(await response.json());

		return new this(json);
	}
}
