import { expect, it } from 'vitest';
import { z } from 'zod';
import { Client } from '../../services/index.js';
import Category from './Category.js';

const client = new Client();

it('should fetch all categories', async () => {
	const categories = await client.fetchCategories();

	for (const category of categories) {
		expect(category).toBeInstanceOf(Category);
	}
});

it('should fetch root categories', async () => {
	const categories = await client.fetchRootCategories();

	for (const category of categories) {
		expect(category.parentToken).toBe(null);
	}
});

it('should fetch category to model relationships', async () => {
	const categoryToModelRelationships = await client.fetchCategoryToModelRelationships();
	const recordSchema = z.record(z.string(), z.array(z.string()));

	expect(recordSchema.safeParse(categoryToModelRelationships).success).toBe(true);
});

it('should fetch a single category', async () => {
	const category = await client.fetchCategoryByToken('CAT:pfy6spah8ny');

	expect(category).toBeInstanceOf(Category);
});

it('should fetch child categories when has children categories', async () => {
	const shouldBeParentCategory = await client.fetchCategoryByToken('CAT:wawxqax1vxy');
	const children = await shouldBeParentCategory?.getChildren();

	expect(children?.length).toBeGreaterThan(0);

	for (const child of children!) {
		expect(child).toBeInstanceOf(Category);
	}
});

it('should return empty array when no child categories can be found', async () => {
	const shouldBeChildCategory = await client.fetchCategoryByToken('CAT:pfy6spah8ny');
	const children = await shouldBeChildCategory?.getChildren();

	expect(children).toEqual([]);
});

it('should fetch parent categories when has parent categories', async () => {
	const shouldBeParentCategory = await client.fetchCategoryByToken('CAT:pfy6spah8ny');
	const parent = await shouldBeParentCategory?.getParent();

	expect(parent).toBeInstanceOf(Category);
});

it('should return undefined when no parent categories can be found', async () => {
	const shouldBeParentCategory = await client.fetchCategoryByToken('CAT:wawxqax1vxy');
	const parent = await shouldBeParentCategory?.getParent();

	expect(parent).toBe(undefined);
});
