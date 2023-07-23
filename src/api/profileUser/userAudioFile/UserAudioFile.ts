import Client from '../../../index.js';
import type { Audio } from '../../../interface/Audio.js';
import { AudioFile } from '../../../services/audioFile/AudioFile.js';
import { constants } from '../../../util/index.js';
import { type UserTtsSchema } from './userAudioFile.schema.js';

export default class UserAudioFile implements Audio {
	constructor(client: Client, data: UserTtsSchema) {
		this.url = new URL(`${constants.GOOGLE_STORAGE_URL}${data.public_bucket_wav_audio_path}`);
		this.audioFile = new AudioFile(client, this.url);

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
	}

	readonly url: URL;
	readonly audioFile: AudioFile;

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
}
