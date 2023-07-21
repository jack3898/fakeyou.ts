/**
 * Converts an array of objects into a map using a common key from all objects.
 * If the object cannot be mapped, it will be ignored.
 * If the value of the map key is null or undefined, it will be ignored.
 *
 * @param commonKey The key found in all objects that will be used as the map key.
 * @param objectMap The array of objects to convert into a map.
 *
 * @returns The map.
 */
export function mapify<T extends object, K extends keyof T>(commonKey: K, objectMap: T[]): Map<T[K], T> {
	const map = new Map<T[K], T>();

	for (const object of objectMap) {
		const mapKey = object[commonKey];

		if (mapKey !== null && mapKey !== undefined) {
			map.set(mapKey, object);
		}
	}

	return map;
}
