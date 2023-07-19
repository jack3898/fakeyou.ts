import { it, expect, beforeEach } from 'vitest';
import Client, { TtsModel } from '../../index.js';

beforeEach(() => {
	TtsModel.client = new Client();
});

it(
	'should fetch models',
	async () => {
		const modelList = await TtsModel.fetchModels();

		expect(modelList.size).toBeGreaterThan(0);
	},
	{ timeout: 30_000 }
);

it(
	'should find model by name',
	async () => {
		const model = await TtsModel.fetchModelByName('Squidward Tentacles');

		expect(model?.title).toContain('Squidward');
	},
	{ timeout: 30_000 }
);

it(
	'should fetch model by model token',
	async () => {
		const model = await TtsModel.fetchModelByToken('TM:4e2xqpwqaggr');

		expect(model?.title).toContain('Squidward');
	},
	{ timeout: 30_000 }
);

it(
	'should fetch user models',
	async () => {
		const models = await TtsModel.fetchModelsByUser('vegito1089');

		expect(models?.length).toBeGreaterThan(0);
	},
	{ timeout: 30_000 }
);

it(
	'should process an inference to buffer with success',
	async () => {
		const model = await TtsModel.fetchModelByName('Squidward Tentacles');
		const audio = await model?.infer('hello');
		const buffer = await audio?.toBuffer();

		expect(buffer).toBeInstanceOf(Buffer);
	},
	{ timeout: 180_000 }
);
