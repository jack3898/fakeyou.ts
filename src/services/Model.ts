import { apiUrl } from '../util/constants.js';
import { poll } from '../util/functions.js';
import {
	ttsInferenceResponse,
	ttsListVoiceResponse,
	ttsRequestStatusResponse,
	type TtsModel,
	type TtsRequestStatusDoneResponse
} from '../util/validation.js';
import Client from './Client.js';
import TtsAudioFile from './TtsAudioFile.js';

export default class Model {
	readonly data: TtsModel;
	static #cache?: Map<string, Model>;

	constructor(data: TtsModel) {
		this.data = data;
	}

	static async fetchModels() {
		if (this.#cache) {
			return this.#cache;
		}

		const response = await Client.fetch(new URL(`${apiUrl}/tts/list`), { method: 'GET' });
		const json = ttsListVoiceResponse.parse(await response.json());

		this.#cache = new Map();

		for (const modelData of json.models) {
			this.#cache.set(modelData.model_token, new Model(modelData));
		}

		return this.#cache;
	}

	/**
	 * This is the fastest method to find the model you need, the token is unique to each model and
	 * can be found in the URL of the model's more details page on fakeyou.com.
	 */
	static async fetchModelByToken(token: string): Promise<Model | undefined> {
		return (await this.fetchModels()).get(token);
	}

	private async fetchInference(text: string) {
		const response = await Client.fetch(new URL(`${apiUrl}/tts/inference`), {
			method: 'POST',
			body: JSON.stringify({
				tts_model_token: this.data.model_token,
				uuid_idempotency_token: crypto.randomUUID(),
				inference_text: text
			})
		});

		return ttsInferenceResponse.parse(await response.json());
	}

	private getAudioUrl(inferenceJobToken: string): Promise<TtsRequestStatusDoneResponse | null> {
		return poll(async () => {
			const response = await Client.fetch(new URL(`${apiUrl}/tts/job/${inferenceJobToken}`), { method: 'GET' });
			const result = ttsRequestStatusResponse.parse(await response.json());

			switch (result.state.status) {
				case 'complete_success':
					return result.state;
				case 'dead':
					return poll.Status.Abort;
				default:
					return poll.Status.Retry;
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
}
