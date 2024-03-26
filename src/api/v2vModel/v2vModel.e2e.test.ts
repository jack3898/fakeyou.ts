import { describe, expect, it } from 'vitest';
import Client from '../../index.js';
import { V2vModel } from './V2vModel.js';

const client = new Client();

it('should fetch all voice to voice models', async () => {
	const models = await client.fetchV2vModels();

	for (const model of models.values()) {
		expect(model).toBeInstanceOf(V2vModel);
	}
});

describe('fetchV2vModelByName', () => {
	it('should fetch a voice to voice model by name', async () => {
		const model = await client.fetchV2vModelByName('Spongebob');

		expect(model).toBeInstanceOf(V2vModel);
		expect(model?.title).includes('Spongebob');
	});

	it("should return undefined when a voice to voice model doesn't exist", async () => {
		const model = await client.fetchV2vModelByName(crypto.randomUUID());

		expect(model).toBeUndefined();
	});
});

describe('fetchV2vModelByToken', () => {
	it('should fetch a voice to voice model by token', async () => {
		const model = await client.fetchV2vModelByToken('weight_aayvwp1m4z3h7wfetjq0h6gaz');

		expect(model).toBeInstanceOf(V2vModel);
	});

	it("should return undefined when a voice to voice model doesn't exist", async () => {
		const model = await client.fetchV2vModelByToken(crypto.randomUUID());

		expect(model).toBeUndefined();
	});
});
