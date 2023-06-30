import { apiUrl } from '../util/constants.js';
import { categoryListResponseSchema, categoryToModelSchema, type CategorySchema } from '../util/validation.js';
import Cache from './Cache.js';
import Model from './Model.js';
import Rest from './Rest.js';

export default class Category {
	constructor(public data: CategorySchema) {}

	static async fetchCategories(): Promise<Category[]> {
		return Cache.wrap('fetch-categories', async () => {
			const response = await Rest.fetch(new URL(`${apiUrl}/category/list/tts`), { method: 'GET' });
			const json = categoryListResponseSchema.parse(await response.json());

			return json.categories.map((category) => new this(category));
		});
	}

	static async fetchRootCategories(): Promise<Category[]> {
		const allCategories = await this.fetchCategories();

		return allCategories.filter((category) => !category.parentToken);
	}

	static async fetchCategoryToModelRelationships() {
		return Cache.wrap('fetch-category-model-relationships', async () => {
			const response = await Rest.fetch(new URL(`${apiUrl}/v1/category/computed_assignments/tts`), { method: 'GET' });
			const json = categoryToModelSchema.parse(await response.json());

			return json.category_token_to_tts_model_tokens.recursive;
		});
	}

	async fetchModels(): Promise<Model[]> {
		const relationships = await Category.fetchCategoryToModelRelationships();
		const allModels = await Model.fetchModels();
		const models = relationships[this.token]
			.map((modelToken) => allModels.get(modelToken))
			.filter((model): model is Model => !!model);

		return models;
	}

	async getParent(): Promise<Category | null> {
		const categories = await Category.fetchCategories();

		return categories.find((categoryFromCache) => categoryFromCache.token === this.parentToken) || null;
	}

	async getChildren(): Promise<Category[]> {
		const categories = await Category.fetchCategories();

		return categories.filter((categoryFromCache) => categoryFromCache.parentToken === this.token);
	}

	get name(): string {
		return this.data.name.trim();
	}

	get token(): string {
		return this.data.category_token;
	}

	get parentToken(): string | null {
		return this.data.maybe_super_category_token;
	}

	get createdAt(): Date {
		return this.data.created_at;
	}

	get deletedAt(): Date | null {
		return this.data.deleted_at;
	}
}
