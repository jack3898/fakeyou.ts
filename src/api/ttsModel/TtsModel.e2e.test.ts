import { describe, expect, it } from 'vitest';
import Client from '../../index.js';
import { TtsModel } from './TtsModel.js';

const client = new Client();

it('should fetch models', async () => {
	const modelList = await client.fetchTtsModels();

	expect(modelList.size).toBeGreaterThan(0);
});

describe('fetchTtsModelByName', () => {
	it('should find model by name', async () => {
		const model = await client.fetchTtsModelByName('Squidward Tentacles');

		expect(model?.title).toContain('Squidward');
	});

	it("should return undefined when a model doesn't exist", async () => {
		const model = await client.fetchTtsModelByName(crypto.randomUUID());

		expect(model).toBeUndefined();
	});
});

describe('fetchTtsModelByToken', () => {
	it('should fetch model by model token', async () => {
		const model = await client.fetchTtsModelByToken('TM:4e2xqpwqaggr');

		expect(model?.title).toContain('Squidward');
	});

	it("should return undefined when a model doesn't exist", async () => {
		const model = await client.fetchTtsModelByToken(crypto.randomUUID());

		expect(model).toBeUndefined();
	});
});

describe('fetchTtsModelsByUser', () => {
	it('should fetch user models', async () => {
		const models = await client.fetchTtsModelsByUser('vegito1089');

		expect(models.length).toBeGreaterThan(0);

		for (const model of models) {
			expect(model).toBeInstanceOf(TtsModel);
		}
	});

	it("should return undefined when a user doesn't exist", async () => {
		const models = await client.fetchTtsModelsByUser(crypto.randomUUID());

		expect(models).toHaveLength(0);
	});
});

it(
	'should process an inference to buffer with success',
	async () => {
		const model = await client.fetchTtsModelByName('Squidward Tentacles');
		const audio = await model?.infer('hello');
		const buffer = await audio?.toBuffer();

		expect(buffer).toBeInstanceOf(Buffer);
	},
	{ timeout: 120_000 }
);
