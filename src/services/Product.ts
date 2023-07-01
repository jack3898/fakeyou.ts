import type { ProductSchema } from '../util/validation.js';

export default class Product {
	constructor(data: ProductSchema) {
		this.namespace = data.namespace;
		this.productSlug = data.product_slug;
	}

	readonly namespace: string;

	readonly productSlug: string;
}
