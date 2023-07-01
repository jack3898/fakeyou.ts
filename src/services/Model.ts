import { apiUrl } from '../util/constants.js';
import { poll } from '../util/poll.js';
import {
	ttsInferenceSchena,
	ttsModelListSchema,
	ttsRequestStatusResponseSchema,
	type TtsModelSchema,
	type TtsInferenceStatusDoneSchema
} from '../util/validation.js';
import TtsAudioFile from './TtsAudioFile.js';
import crypto from 'node:crypto';
import Category from './Category.js';
import { cache } from '../util/cache.js';
import { request } from '../util/request.js';

export default class Model {
	constructor(public data: TtsModelSchema) {}

	static fetchModels() {
		return cache('fetch-models', async () => {
			const response = await request(new URL(`${apiUrl}/tts/list`), { method: 'GET' });
			const json = ttsModelListSchema.parse(await response.json());

			const map = new Map<string, Model>();

			for (const modelData of json.models) {
				map.set(modelData.model_token, new this(modelData));
			}

			return map;
		});
	}

	/**
	 * This is the fastest method to find the model you need, the token is unique to each model and
	 * can be found in the URL of the model's more details page on fakeyou.com.
	 */
	static async fetchModelByToken(token: string): Promise<Model | undefined> {
		return (await this.fetchModels()).get(token);
	}

	private async fetchInference(text: string) {
		const response = await request(new URL(`${apiUrl}/tts/inference`), {
			method: 'POST',
			body: JSON.stringify({
				tts_model_token: this.data.model_token,
				uuid_idempotency_token: crypto.randomUUID(),
				inference_text: text
			})
		});

		return ttsInferenceSchena.parse(await response.json());
	}

	private getAudioUrl(inferenceJobToken: string): Promise<TtsInferenceStatusDoneSchema | null> {
		return poll(async () => {
			const response = await request(new URL(`${apiUrl}/tts/job/${inferenceJobToken}`), { method: 'GET' });
			const result = ttsRequestStatusResponseSchema.parse(await response.json());

			switch (result.state.status) {
				case 'pending':
					return poll.Status.Retry;
				case 'started':
					return poll.Status.Retry;
				case 'complete_success':
					return result.state;
				case 'attempt_failed':
					return poll.Status.Retry;
				case 'complete_failure':
					return poll.Status.Abort;
				case 'dead':
					return poll.Status.Abort;
				default:
					return poll.Status.Abort;
			}
		});
	}

	async infer(text: string): Promise<TtsAudioFile | null> {
		const inference = await this.fetchInference(text);
		const data = await this.getAudioUrl(inference.inference_job_token);

		if (data) {
			return new TtsAudioFile(data);
		}

		return null;
	}

	async fetchParentCategories(): Promise<Category[]> {
		const categories = await Category.fetchCategories();

		return categories.filter((category) => this.categoryTokens.includes(category.token));
	}

	get title(): string {
		return this.data.title;
	}

	get token(): string {
		return this.data.model_token;
	}

	get categoryTokens(): string[] {
		return this.data.category_tokens;
	}

	get createdAt(): Date {
		return this.data.created_at;
	}

	get updatedAt(): Date {
		return this.updatedAt;
	}

	get ttsModelType(): string {
		return this.data.tts_model_type;
	}

	get creatorUsername(): string {
		return this.data.creator_username;
	}

	get creatorToken(): string {
		return this.data.creator_user_token;
	}

	get creatorGravatarHash(): string {
		return this.data.creator_gravatar_hash;
	}

	get ietfLanguageTag(): string {
		return this.data.ietf_language_tag;
	}

	get ietfPrimaryLanguageSubtag(): string {
		return this.data.ietf_primary_language_subtag;
	}
}
