import { apiUrl } from '../util/constants.js';
import { categoryListResponseSchema, categoryToModelSchema, type CategorySchema } from '../util/validation.js';
import Model from './Model.js';
import Rest from './Rest.js';

export default class Category {
	constructor(public data: CategorySchema) {}

	static #categories: Category[] = [];

	static async fetchCategories(categoryIds?: string[]): Promise<Category[]> {
		const response = await Rest.fetch(new URL(`${apiUrl}/category/list/tts`), { method: 'GET' });
		const json = categoryListResponseSchema.parse(await response.json());

		this.#categories = json.categories.map((category) => new this(category));

		if (categoryIds) {
			return this.#categories.filter((category) => categoryIds.includes(category.data.category_token));
		}

		return this.#categories;
	}

	static async fetchRootCategories(): Promise<Category[]> {
		const allCategories = await this.fetchCategories();

		return allCategories.filter((category) => !category.parentToken);
	}

	static async fetchCategoryToModelRelationships() {
		const response = await Rest.fetch(new URL(`${apiUrl}/v1/category/computed_assignments/tts`), { method: 'GET' });
		const json = categoryToModelSchema.parse(await response.json());

		return json.category_token_to_tts_model_tokens.recursive;
	}

	async fetchModels(): Promise<Model[]> {
		const relationships = await Category.fetchCategoryToModelRelationships();
		const allModels = await Model.fetchModels();
		const models = relationships[this.token]
			.map((modelToken) => allModels.get(modelToken))
			.filter((model): model is Model => !!model);

		return models;
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

	get parent(): Category | null {
		return Category.#categories.find((categoryFromCache) => categoryFromCache.token === this.parentToken) || null;
	}

	get children(): Category[] {
		return Category.#categories.filter((categoryFromCache) => categoryFromCache.parentToken === this.token);
	}

	get createdAt(): Date {
		return this.data.created_at;
	}

	get deletedAt(): Date | null {
		return this.data.deleted_at;
	}
}
