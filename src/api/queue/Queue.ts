import type Client from '../../index.js';
import { constants, prettyParse } from '../../util/index.js';
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

	static client: Client;

	/**
	 * Fetch the current FakeYou TTS queue.
	 *
	 * This is the number of jobs that are currently waiting to be processed by the FakeYou TTS engine.
	 *
	 * @returns The queue
	 */
	static async fetchQueue(): Promise<Queue> {
		const response = await this.client.rest.send(new URL(`${constants.API_URL}/tts/queue_length`));
		const json = prettyParse(queueLengthResponseSchema, await response.json());

		return new this(json);
	}
}
