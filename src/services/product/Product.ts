import { type ProductSchema } from './product.schema.js';

export default class Product {
	constructor(data: ProductSchema) {
		this.namespace = data.namespace;
		this.productSlug = data.product_slug;
	}

	readonly namespace: string;

	readonly productSlug: string;
}
