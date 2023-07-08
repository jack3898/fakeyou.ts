import { it, expect } from 'vitest';
import { Model } from '../../index.js';

it(
	'should fetch models',
	async () => {
		const modelList = await Model.fetchModels();

		expect(modelList.size).toBeGreaterThan(0);
	},
	{ timeout: 30_000 }
);

it(
	'should find model by name',
	async () => {
		const model = await Model.fetchModelByName('Squidward Tentacles');

		expect(model?.title).toContain('Squidward');
	},
	{ timeout: 30_000 }
);

it(
	'should fetch model by model token',
	async () => {
		const model = await Model.fetchModelByToken('TM:4e2xqpwqaggr');

		expect(model?.title).toContain('Squidward');
	},
	{ timeout: 30_000 }
);

it(
	'should fetch user models',
	async () => {
		const models = await Model.fetchModelsByUser('vegito1089');

		expect(models?.length).toBeGreaterThan(0);
	},
	{ timeout: 30_000 }
);

it(
	'should process an inference to buffer with success',
	async () => {
		const model = await Model.fetchModelByName('Squidward Tentacles');
		const audio = await model?.infer('hello');
		const base64 = await audio?.toBuffer();

		expect(base64).toBeInstanceOf(Buffer);
	},
	{ timeout: 60_000 }
);
