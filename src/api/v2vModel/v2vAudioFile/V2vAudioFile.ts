import { implToBase64, implToBuffer, implToDisk, type Audio } from '../../../implementation/index.js';
import { Client } from '../../../services/index.js';
import { constants } from '../../../util/index.js';
import type { V2vModel } from '../V2vModel.js';
import { type V2vInferenceStatusDoneSchema } from '../v2vModel.schema.js';

export class V2vAudioFile implements Audio {
	constructor(client: Client, data: V2vInferenceStatusDoneSchema) {
		this.client = client;
		this.resourceUrl = `${constants.GOOGLE_STORAGE_URL}${data.maybe_result.maybe_public_bucket_media_path}`;

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
	}

	readonly client: Client;
	readonly resourceUrl: string;

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

	/**
	 * Fetch the model that was used to convert this audio file.
	 *
	 * @returns The model that was used to convert this audio file. Undefined if no model could be found.
	 */
	async fetchModel(): Promise<V2vModel | undefined> {
		return this.client.fetchV2vModelByToken(this.entityToken);
	}

	/**
	 * Fetch the audio file as a buffer.
	 *
	 * @function
	 */
	toBuffer = implToBuffer;

	/**
	 * Convert the audio file to a base64 string.
	 */
	toBase64 = implToBase64;

	/**
	 * Write the audio file to disk.
	 */
	toDisk = implToDisk;
}
