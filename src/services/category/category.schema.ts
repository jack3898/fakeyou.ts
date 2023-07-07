import { z } from 'zod';
import { fakeyouResponse } from '../../global.schema.js';

export type CategorySchema = z.infer<typeof categorySchema>;
export type CategoryListResponseSchema = z.infer<typeof categoryListResponseSchema>;
export type categoryToModelSchema = z.infer<typeof categoryToModelSchema>;

export const categorySchema = z.object({
	category_token: z.string(),
	maybe_super_category_token: z.string().nullable(),
	model_type: z.string(),
	name: z.string(),
	name_for_dropdown: z.string(),
	can_directly_have_models: z.boolean(),
	can_have_subcategories: z.boolean(),
	can_only_mods_apply: z.boolean(),
	is_mod_approved: z.boolean().nullable(),
	is_synthetic: z.boolean(),
	should_be_sorted: z.boolean(),
	created_at: z.date({ coerce: true }),
	updated_at: z.date({ coerce: true }),
	deleted_at: z.date({ coerce: true }).nullable()
});

export const categoryListResponseSchema = fakeyouResponse.extend({
	categories: z.array(categorySchema)
});

export const categoryToModelSchema = fakeyouResponse.extend({
	category_token_to_tts_model_tokens: z.object({
		recursive: z.record(z.string(), z.array(z.string()))
	})
});
