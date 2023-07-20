import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import type { AudioFile } from '../../interface/AudioFile.js';
import { constants } from '../../util/index.js';
import { type V2vInferenceStatusDoneSchema } from '../v2vmodel/v2vModel.schema.js';
import V2vModel from '../v2vmodel/V2vModel.js';
import type Client from '../../services/index.js';

const writeFile = promisify(fs.writeFile);

export default class V2vAudioFile implements AudioFile {
	constructor(data: V2vInferenceStatusDoneSchema) {
		this.jobToken = data.job_token;
		this.requestInferenceCategory = data.request.inference_category;
		this.requestMaybeModelType = data.request.maybe_model_type;
		this.requestMaybeModelToken = data.request.maybe_model_token;
		this.requestMaybeModelTitle = data.request.maybe_model_title;
		this.requestMaybeRawInferenceText = data.request.maybe_raw_inference_text;
		this.statusMaybeExtraStatusDescription = data.status.maybe_extra_status_description;
		this.statusMaybeAssignedWorker = data.status.maybe_assigned_worker;
		this.statusMaybeAssignedCluster = data.status.maybe_assigned_cluster;
		this.statusMaybeFirstStartedAt = data.status.maybe_first_started_at;
		this.statusAttemptCount = data.status.attempt_count;
		this.statusRequiresKeepalive = data.status.requires_keepalive;
		this.entityType = data.maybe_result.entity_type;
		this.entityToken = data.maybe_result.entity_token;
		this.publicBucketMediaPath = data.maybe_result.maybe_public_bucket_media_path;
		this.maybeSuccessfullyCompletedAt = data.maybe_result.maybe_successfully_completed_at;
		this.createdAt = data.created_at;
		this.updatedAt = data.updated_at;
		this.url = new URL(`${constants.GOOGLE_STORAGE_URL}${data.maybe_result.maybe_public_bucket_media_path}`);
	}

	readonly jobToken: string;
	readonly requestInferenceCategory: string;
	readonly requestMaybeModelType: string | null;
	readonly requestMaybeModelToken: string | null;
	readonly requestMaybeModelTitle: string | null;
	readonly requestMaybeRawInferenceText: string | null;
	readonly statusMaybeExtraStatusDescription: string | null;
	readonly statusMaybeAssignedWorker: string | null;
	readonly statusMaybeAssignedCluster: string | null;
	readonly statusMaybeFirstStartedAt: Date | null;
	readonly statusAttemptCount: number;
	readonly statusRequiresKeepalive: boolean;
	readonly entityType: string;
	readonly entityToken: string;
	readonly publicBucketMediaPath: string;
	readonly maybeSuccessfullyCompletedAt: Date | null;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly url: URL;

	#buffer?: Buffer;

	static client: Client;

	/**
	 * The buffer of the audio file.
	 *
	 * @returns The buffer of the audio file.
	 */
	async toBuffer(): Promise<Buffer | undefined> {
		if (this.#buffer) {
			return this.#buffer;
		}

		const wav = await V2vAudioFile.client.rest.download(this.url, 'audio/wav');

		if (wav) {
			this.#buffer = wav;

			return this.#buffer;
		}
	}

	/**
	 * Convert the audio file to a base64 string.
	 *
	 * @returns A promise that resolves to the base64 string of the audio file.
	 */
	async toBase64(): Promise<string | undefined> {
		const buffer = await this.toBuffer();

		return buffer && Buffer.from(buffer).toString('base64');
	}

	/**
	 * Write the audio file to disk.
	 *
	 * @param location The location to write the audio file to.
	 * @returns A promise that resolves when the audio file has been written to disk.
	 */
	async toDisk(location: `${string}.wav`): Promise<void> {
		const buffer = await this.toBuffer();

		if (buffer) {
			return writeFile(path.resolve(location), buffer);
		}
	}

	/**
	 * Fetch the model that was used to convert this audio file.
	 *
	 * @returns The model that was used to convert this audio file. Undefined if no model could be found.
	 */
	async fetchModel(): Promise<V2vModel | undefined> {
		return V2vModel.fetchModelByToken(this.entityToken);
	}
}
