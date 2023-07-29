import { implToBase64, implToBuffer, implToDisk } from '../../implementation/Audio.js';
import { Client, type Audio } from '../../index.js';
import { constants } from '../../util/index.js';
import { TtsResultSchema } from './ttsResult.schema.js';

/**
 * The complete data for a TTS result. This contains extras like the spectrogram and other metadata like
 * what worker generated the file, is a debug request, etc.
 */
export class TtsResult implements Audio {
	/**
	 * @param client The main client.
	 * @param data The raw TTS result data from the FakeYou API.
	 */
	constructor(client: Client, data: TtsResultSchema) {
		this.client = client;
		this.resourceUrl = `${constants.GOOGLE_STORAGE_URL}${data.public_bucket_wav_audio_path}`;
		this.spectrogramUrl = `${constants.GOOGLE_STORAGE_URL}${data.public_bucket_spectrogram_path}`;

		this.ttsResultToken = data.tts_result_token;
		this.rawInferenceText = data.raw_inference_text;
		this.ttsModelToken = data.tts_model_token;
		this.ttsModelTitle = data.tts_model_title;
		this.maybePretrainedVocoderUsed = data.maybe_pretrained_vocoder_used;
		this.maybeCreatorUserToken = data.maybe_creator_user_token;
		this.maybeCreatorUsername = data.maybe_creator_username;
		this.maybeCreatorDisplayName = data.maybe_creator_display_name;
		this.maybeCreatorGravatarHash = data.maybe_creator_gravatar_hash;
		this.maybeModelCreatorUserToken = data.maybe_model_creator_user_token;
		this.maybeModelCreatorUsername = data.maybe_model_creator_username;
		this.maybeModelCreatorDisplayName = data.maybe_model_creator_display_name;
		this.maybeModelCreatorGravatarHash = data.maybe_model_creator_gravatar_hash;
		this.publicBucketWavAudioPath = data.public_bucket_wav_audio_path;
		this.publicBucketSpectrogramPath = data.public_bucket_spectrogram_path;
		this.creatorSetVisibility = data.creator_set_visibility;
		this.generatedByWorker = data.generated_by_worker;
		this.isDebugRequest = data.is_debug_request;
		this.fileSizeBytes = data.file_size_bytes;
		this.durationMillis = data.duration_millis;
		this.createdAt = data.created_at;
		this.updatedAt = data.updated_at;
	}

	client: Client;
	resourceUrl: string;
	/**
	 * Raw spectrogram data, it is not an image.
	 */
	spectrogramUrl: string;

	ttsResultToken: string;
	rawInferenceText: string;
	ttsModelToken: string;
	ttsModelTitle: string;
	maybePretrainedVocoderUsed: string | null;
	maybeCreatorUserToken: string | null;
	maybeCreatorUsername: string | null;
	maybeCreatorDisplayName: string | null;
	maybeCreatorGravatarHash: string | null;
	maybeModelCreatorUserToken: string | null;
	maybeModelCreatorUsername: string | null;
	maybeModelCreatorDisplayName: string | null;
	maybeModelCreatorGravatarHash: string | null;
	publicBucketWavAudioPath: string;
	publicBucketSpectrogramPath: string;
	creatorSetVisibility: string;
	generatedByWorker: string;
	isDebugRequest: boolean;
	fileSizeBytes: number;
	durationMillis: number;
	createdAt: Date;
	updatedAt: Date;

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
}
