import {
	implFetchUser,
	implToBase64,
	implToBuffer,
	implToDisk,
	type Audio,
	type User
} from '../../../implementation/index.js';
import Client from '../../../index.js';
import { constants } from '../../../util/index.js';
import { type TtsResult } from '../../ttsResult/TtsResult.js';
import { type UserTtsSchema } from './userAudioFile.schema.js';

export class UserAudioFile implements Audio, User {
	/**
	 * @param client The main client.
	 * @param data The raw user audio file data from the FakeYou API.
	 */
	constructor(client: Client, data: UserTtsSchema) {
		this.client = client;
		this.resourceUrl = `${constants.GOOGLE_STORAGE_URL}${data.public_bucket_wav_audio_path}`;
		this.webUrl = `${constants.SITE_URL}/tts/result/${data.tts_result_token}`;

		this.ttsResultToken = data.tts_result_token;
		this.ttsModelToken = data.tts_model_token;
		this.ttsModelTitle = data.tts_model_title;
		this.rawInferenceText = data.raw_inference_text;
		this.publicBucketWavAudioPath = data.public_bucket_wav_audio_path;
		this.creatorUserToken = data.maybe_creator_user_token;
		this.creatorUsername = data.maybe_creator_username;
		this.username = data.maybe_creator_username;
		this.creatorDisplayName = data.maybe_creator_display_name;
		this.creatorResultId = data.maybe_creator_result_id;
		this.fileSizeBytes = data.file_size_bytes;
		this.durationMillis = data.duration_millis;
		this.visibility = data.visibility;
		this.createdAt = data.created_at;
		this.updatedAt = data.updated_at;
	}

	readonly client: Client;
	readonly resourceUrl: string;
	/**
	 * The URL to view this audio file in a browser.
	 */
	readonly webUrl: string;

	readonly ttsResultToken: string;
	readonly ttsModelToken: string;
	readonly ttsModelTitle: string;
	readonly rawInferenceText: string;
	readonly publicBucketWavAudioPath: string;
	readonly creatorUserToken: string;
	readonly creatorUsername: string;
	/**
	 * @alias creatorUsername
	 */
	readonly username: string;
	readonly creatorDisplayName: string;
	readonly creatorResultId: number;
	readonly fileSizeBytes: number;
	readonly durationMillis: number;
	readonly visibility: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;

	/**
	 * Fetch the user that created this audio file.
	 */
	fetchProfile = implFetchUser;

	/**
	 * Fetch the audio file as a buffer.
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

	/**
	 * Fetch more details about this audio file.
	 */
	fetchFullResult(): Promise<TtsResult | undefined> {
		return this.client.fetchTtsResultByToken(this.ttsResultToken);
	}
}
