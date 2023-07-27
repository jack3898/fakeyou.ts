import Client from '../../index.js';
import { type BaseClass } from '../../interface/BaseClass.js';
import type { TtsModel } from '../ttsModel/TtsModel.js';
import { type CategorySchema } from './category.schema.js';

/**
 * A TTS category. This is a category that TTS models can belong to.
 * Categories can also have subcategories.
 */
export class Category implements BaseClass {
	constructor(client: Client, data: CategorySchema) {
		this.client = client;

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

	readonly client: Client;

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

	/**
	 * Fetch models that belong to this category.
	 *
	 * @returns A list of tts models that belong to this category. The array is empty if no models belong to this category.
	 */
	async fetchModels(): Promise<TtsModel[]> {
		const relationships = await this.client.fetchCategoryToModelRelationships();
		const allModels = await this.client.fetchTtsModels();
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
		const categories = await this.client.fetchCategories();

		return categories.find((categoryFromCache) => categoryFromCache.token === this.parentToken);
	}

	/**
	 * Fetch the child categories of this category.
	 *
	 * @returns The child categories of this category. Empty array if this category has no children.
	 */
	async getChildren(): Promise<Category[]> {
		const categories = await this.client.fetchCategories();

		return categories.filter((categoryFromCache) => categoryFromCache.parentToken === this.token);
	}
}
