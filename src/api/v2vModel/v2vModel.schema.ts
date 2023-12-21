import { z } from 'zod';
import { fakeyouResponse, fakeyouResponseFalse, fakeyouResponseTrue, visibilitySchema } from '../../global.schema.js';

export type V2vModelSchema = z.infer<typeof v2vModelSchema>;
export type V2vModelListSchema = z.infer<typeof v2vModelListSchema>;
export type V2vVoiceUploadResponseSchema = z.infer<typeof v2vVoiceUploadResponseSchema>;
export type V2vInferenceResultSchema = z.infer<typeof v2vInferenceResultSchema>;
export type V2vInferenceSchema = z.infer<typeof v2vInferenceSchema>;
export type V2vInferenceStatusSchema = z.infer<typeof v2vInferenceStatusSchema>;
export type V2vInferenceStatusDoneSchema = z.infer<typeof v2vInferenceStatusDoneSchema>;
export type V2vRequestStatusResponseSchema = z.infer<typeof v2vRequestStatusResponseSchema>;

export const v2vModelSchema = z.object({
	token: z.string(),
	model_type: z.string(),
	title: z.string(),
	creator: z.object({
		user_token: z.string(),
		username: z.string(),
		display_name: z.string(),
		gravatar_hash: z.string()
	}),
	creator_set_visibility: visibilitySchema,
	ietf_language_tag: z.string(),
	ietf_primary_language_subtag: z.string(),
	is_front_page_featured: z.boolean(),
	created_at: z.date({ coerce: true }),
	updated_at: z.date({ coerce: true })
});

export const v2vModelListSchema = fakeyouResponse.extend({
	models: z.array(v2vModelSchema)
});

export const v2vVoiceUploadResponseSchema = fakeyouResponse.extend({
	upload_token: z.string()
});

export const v2vInferenceSchema = fakeyouResponseTrue.extend({
	inference_job_token: z.string()
});

export const v2vInferenceErrorSchema = fakeyouResponseFalse.extend({
	error_reason: z.string()
});

export const v2vInferenceResultSchema = z.union([v2vInferenceSchema, v2vInferenceErrorSchema]);

export const v2vInferenceStatusSchema = z.object({
	job_token: z.string(),
	request: z.object({
		inference_category: z.string(),
		maybe_model_type: z.string().nullable(),
		maybe_model_token: z.string().nullable(),
		maybe_model_title: z.string().nullable(),
		maybe_raw_inference_text: z.string().nullable()
	}),
	status: z.object({
		// My confidence with this union is low, as I do not know exactly what it may be.
		// So far it's just using the same enum as the TTS model schema.
		status: z.enum(['pending', 'started', 'complete_failure', 'attempt_failed', 'dead']),
		maybe_extra_status_description: z.string().nullable(),
		maybe_assigned_worker: z.string().nullable(),
		maybe_assigned_cluster: z.string().nullable(),
		maybe_first_started_at: z.date({ coerce: true }).nullable(),
		attempt_count: z.number(),
		requires_keepalive: z.boolean()
	}),
	maybe_result: z.null(),
	created_at: z.date({ coerce: true }),
	updated_at: z.date({ coerce: true })
});

export const v2vInferenceStatusDoneSchema = z.object({
	job_token: z.string(),
	request: z.object({
		inference_category: z.string(),
		maybe_model_type: z.string().nullable(),
		maybe_model_token: z.string().nullable(),
		maybe_model_title: z.string().nullable(),
		maybe_raw_inference_text: z.string().nullable()
	}),
	status: z.object({
		status: z.literal('complete_success'),
		maybe_extra_status_description: z.string().nullable(),
		maybe_assigned_worker: z.string().nullable(),
		maybe_assigned_cluster: z.string().nullable(),
		maybe_first_started_at: z.date({ coerce: true }).nullable(),
		attempt_count: z.number(),
		requires_keepalive: z.boolean()
	}),
	maybe_result: z.object({
		entity_type: z.string(),
		entity_token: z.string(),
		maybe_public_bucket_media_path: z.string(),
		maybe_successfully_completed_at: z.date({ coerce: true }).nullable()
	}),
	created_at: z.date({ coerce: true }),
	updated_at: z.date({ coerce: true })
});

export const v2vRequestStatusResponseSchema = fakeyouResponse.extend({
	state: z.union([v2vInferenceStatusSchema, v2vInferenceStatusDoneSchema])
});
