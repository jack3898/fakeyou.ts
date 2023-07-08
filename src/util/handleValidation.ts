import { ZodError, type ZodSchema, type z } from 'zod';
import { fromZodError, ValidationError } from 'zod-validation-error';
import { log } from './index.js';
import { inspect } from 'node:util';

/**
 * Zod schema.parse wrapper that throws nicer errors than what zod gives you out of the box.
 */
export function prettyParse<T extends ZodSchema>(schema: T, value: unknown): z.infer<T> {
	try {
		return schema.parse(value);
	} catch (error) {
		if (error instanceof ZodError) {
			const validationError = fromZodError(error);
			const inspectedData = inspect(value, { colors: true, maxArrayLength: 3 });

			log.error(`Fakeyou.ts received unexpected data.\nFollowing does not match schema: ${inspectedData}\n`);

			throw new ValidationError(validationError.message);
		}

		throw error;
	}
}
