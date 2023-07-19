import type Client from '../../index.js';
import { constants, prettyParse } from '../../util/index.js';
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

	static client: Client;

	/**
	 * Fetch all available categories which hold tts models and child categories.
	 *
	 * @returns A list of all available categories including their child categories.
	 */
	static async fetchCategories(): Promise<Category[]> {
		return this.client.cache.wrap('fetch-categories', async () => {
			const response = await this.client.rest.send(new URL(`${constants.API_URL}/category/list/tts`));
			const json = prettyParse(categoryListResponseSchema, await response.json());

			return json.categories.map((category) => new this(category));
		});
	}

	/**
	 * Fetch all root categories which hold tts models and child categories. Root categories are categories which have no parent category.
	 *
	 * @returns A list of all root categories.
	 */
	static async fetchRootCategories(): Promise<Category[]> {
		const allCategories = await this.fetchCategories();

		return allCategories.filter((category) => !category.parentToken);
	}

	/**
	 * Fetch all category to model relationships. This is used to determine which models belong to which categories.
	 *
	 * @returns A map of category tokens to tts model tokens.
	 */
	static async fetchCategoryToModelRelationships(): Promise<Record<string, string[]>> {
		return this.client.cache.wrap('fetch-category-model-relationships', async () => {
			const response = await this.client.rest.send(
				new URL(`${constants.API_URL}/v1/category/computed_assignments/tts`)
			);
			const json = prettyParse(categoryToModelSchema, await response.json());

			return json.category_token_to_tts_model_tokens.recursive;
		});
	}

	/**
	 * Fetch a category by its token.
	 *
	 * @param token The token of the category to fetch
	 * @returns The category
	 */
	static async fetchCategoryByToken(token: string): Promise<Category | undefined> {
		const categories = await this.fetchCategories();

		return categories.find((category) => category.token === token);
	}

	/**
	 * Fetch models that belong to this category.
	 *
	 * @returns A list of tts models that belong to this category. The array is empty if no models belong to this category.
	 */
	async fetchModels(): Promise<TtsModel[]> {
		const relationships = await Category.fetchCategoryToModelRelationships();
		const allModels = await TtsModel.fetchModels();
		const models = relationships[this.token]
			.map((modelToken) => allModels.get(modelToken))
			.filter((model): model is TtsModel => !!model);

		return models;
	}

	/**
	 * Fetch the parent category of this category.
	 *
	 * @returns The parent category of this category. Undefined if this category has no parent.
	 */
	async getParent(): Promise<Category | undefined> {
		const categories = await Category.fetchCategories();

		return categories.find((categoryFromCache) => categoryFromCache.token === this.parentToken);
	}

	/**
	 * Fetch the child categories of this category.
	 *
	 * @returns The child categories of this category. Empty array if this category has no children.
	 */
	async getChildren(): Promise<Category[]> {
		const categories = await Category.fetchCategories();

		return categories.filter((categoryFromCache) => categoryFromCache.parentToken === this.token);
	}
}
