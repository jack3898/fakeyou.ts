import type Client from '../../../index.js';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import type { AudioFile } from '../../../interface/AudioFile.js';
import { constants } from '../../../util/index.js';
import { type UserTtsSchema } from './userAudioFile.schema.js';

const writeFile = promisify(fs.writeFile);

export default class UserAudioFile implements AudioFile {
	constructor(data: UserTtsSchema) {
		this.ttsResultToken = data.tts_result_token;
		this.ttsModelToken = data.tts_model_token;
		this.ttsModelTitle = data.tts_model_title;
		this.rawInferenceText = data.raw_inference_text;
		this.publicBucketWavAudioPath = data.public_bucket_wav_audio_path;
		this.creatorUserToken = data.maybe_creator_user_token;
		this.creatorUsername = data.maybe_creator_username;
		this.creatorDisplayName = data.maybe_creator_display_name;
		this.creatorResultId = data.maybe_creator_result_id;
		this.fileSizeBytes = data.file_size_bytes;
		this.durationMillis = data.duration_millis;
		this.visibility = data.visibility;
		this.createdAt = data.created_at;
		this.updatedAt = data.updated_at;
		this.url = new URL(`${constants.GOOGLE_STORAGE_URL}${data.public_bucket_wav_audio_path}`);
	}

	readonly ttsResultToken: string;
	readonly ttsModelToken: string;
	readonly ttsModelTitle: string;
	readonly rawInferenceText: string;
	readonly publicBucketWavAudioPath: string;
	readonly creatorUserToken: string;
	readonly creatorUsername: string;
	readonly creatorDisplayName: string;
	readonly creatorResultId: number;
	readonly fileSizeBytes: number;
	readonly durationMillis: number;
	readonly visibility: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly url: URL;

	static client: Client;

	#buffer?: Buffer;

	/**
	 * Convert the audio file to a buffer.
	 *
	 * @returns The buffer.
	 */
	async toBuffer(): Promise<Buffer | undefined> {
		if (this.#buffer) {
			return this.#buffer;
		}

		const wav = await UserAudioFile.client.rest.download(this.url, 'audio/wav');

		if (wav) {
			this.#buffer = wav;

			return this.#buffer;
		}
	}

	/**
	 * Convert the audio file to a base64 string.
	 *
	 * @returns The base64 string.
	 */
	async toBase64(): Promise<string | undefined> {
		const buffer = await this.toBuffer();

		return buffer && Buffer.from(buffer).toString('base64');
	}

	/**
	 * Write the audio file to disk.
	 *
	 * @param location The location to write the file to (including the file type)
	 * @returns A promise that resolves when the file has been written.
	 * @rejects If the file could not be written.
	 */
	async toDisk(location: `${string}.wav`): Promise<void> {
		const buffer = await this.toBuffer();

		if (buffer) {
			return writeFile(path.resolve(location), buffer);
		}
	}
}
