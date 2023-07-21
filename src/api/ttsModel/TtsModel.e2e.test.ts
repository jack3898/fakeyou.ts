import { it, expect } from 'vitest';
import Client from '../../index.js';

const client = new Client();

it('should fetch models', async () => {
	const modelList = await client.ttsModel.fetchModels();

	expect(modelList.size).toBeGreaterThan(0);
});

it('should find model by name', async () => {
	const model = await client.ttsModel.fetchModelByName('Squidward Tentacles');

	expect(model?.title).toContain('Squidward');
});

it('should fetch model by model token', async () => {
	const model = await client.ttsModel.fetchModelByToken('TM:4e2xqpwqaggr');

	expect(model?.title).toContain('Squidward');
});

it('should fetch user models', async () => {
	const models = await client.ttsModel.fetchModelsByUser('vegito1089');

	expect(models?.length).toBeGreaterThan(0);
});

it(
	'should process an inference to buffer with success',
	async () => {
		const model = await client.ttsModel.fetchModelByName('Squidward Tentacles');
		const audio = await model?.infer('hello');
		const buffer = await audio?.toBuffer();

		expect(buffer).toBeInstanceOf(Buffer);
	},
	{ timeout: 120_000 }
);
