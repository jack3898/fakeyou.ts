import { constants, request } from '../../util/index.js';
import { queueLengthResponseSchema, type QueueLengthResponseSchema } from './queue.schema.js';

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
		const response = await request.send(new URL(`${constants.API_URL}/tts/queue_length`));
		const json = queueLengthResponseSchema.parse(await response.json());

		return new this(json);
	}
}
