import { cache, constants, prettyParse, request } from '../../util/index.js';
import TtsModel from '../ttsModel/TtsModel.js';
import { categoryListResponseSchema, categoryToModelSchema, type CategorySchema } from './category.schema.js';

export default class Category {
	constructor(data: CategorySchema) {
		this.token = data.category_token;
		this.parentToken = data.maybe_super_category_token;
		this.modelType = data.model_type;
		this.name = data.name.trim();
		this.nameForDropdown = data.name_for_dropdown.trim();
		this.canDirectlyHaveModels = data.can_directly_have_models;
		this.canHaveSubcategories = data.can_have_subcategories;
		this.canOnlyModsApply = data.can_only_mods_apply;
		this.isModApproved = data.is_mod_approved;
		this.isSynthetic = data.is_synthetic;
		this.shouldBeSorted = data.should_be_sorted;
		this.createdAt = data.created_at;
		this.updatedAt = data.updated_at;
		this.deletedAt = data.deleted_at;
	}

	readonly token: string;
	readonly parentToken: string | null;
	readonly modelType: string;
	readonly name: string;
	readonly nameForDropdown: string;
	readonly canDirectlyHaveModels: boolean;
	readonly canHaveSubcategories: boolean;
	readonly canOnlyModsApply: boolean;
	readonly isModApproved: boolean | null;
	readonly isSynthetic: boolean;
	readonly shouldBeSorted: boolean;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly deletedAt: Date | null;

	static async fetchCategories(): Promise<Category[]> {
		return cache.wrap('fetch-categories', async () => {
			const response = await request.send(new URL(`${constants.API_URL}/category/list/tts`));
			const json = prettyParse(categoryListResponseSchema, await response.json());

			return json.categories.map((category) => new this(category));
		});
	}

	static async fetchRootCategories(): Promise<Category[]> {
		const allCategories = await this.fetchCategories();

		return allCategories.filter((category) => !category.parentToken);
	}

	static async fetchCategoryToModelRelationships(): Promise<Record<string, string[]>> {
		return cache.wrap('fetch-category-model-relationships', async () => {
			const response = await request.send(new URL(`${constants.API_URL}/v1/category/computed_assignments/tts`));
			const json = prettyParse(categoryToModelSchema, await response.json());

			return json.category_token_to_tts_model_tokens.recursive;
		});
	}

	static async fetchCategoryByToken(token: string): Promise<Category | undefined> {
		const categories = await this.fetchCategories();

		return categories.find((category) => category.token === token);
	}

	async fetchModels(): Promise<TtsModel[]> {
		const relationships = await Category.fetchCategoryToModelRelationships();
		const allModels = await TtsModel.fetchModels();
		const models = relationships[this.token]
			.map((modelToken) => allModels.get(modelToken))
			.filter((model): model is TtsModel => !!model);

		return models;
	}
	async getParent(): Promise<Category | undefined> {
		const categories = await Category.fetchCategories();

		return categories.find((categoryFromCache) => categoryFromCache.token === this.parentToken);
	}

	async getChildren(): Promise<Category[]> {
		const categories = await Category.fetchCategories();

		return categories.filter((categoryFromCache) => categoryFromCache.parentToken === this.token);
	}
}
