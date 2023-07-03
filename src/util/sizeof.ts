/**
 * THIS CODE IS NOT WRITTEN BY THE AUTHOR OF FAKEYOU.TS
 * (which is why types here are weak 🤣 sorry, had to say it)
 *
 * @see https://github.com/miktam/sizeof
 *
 * Original code does not support esmodules, so I copied it here and changed it just enough to make TypeScript happy!
 * Adapted to support esmodules so I can use it in the code as a means to manage the cache size.
 */

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Copyright 2023 ChatGPT May 24 Version

const ECMA_SIZES = {
	STRING: 2,
	BOOLEAN: 4,
	BYTES: 4,
	NUMBER: 8,
	Int8Array: 1,
	Uint8Array: 1,
	Uint8ClampedArray: 1,
	Int16Array: 2,
	Uint16Array: 2,
	Int32Array: 4,
	Uint32Array: 4,
	Float32Array: 4,
	Float64Array: 8
};

/**
 * Precisely calculate size of string in node
 * Based on https://stackoverflow.com/questions/68789144/how-much-memory-do-v8-take-to-store-a-string/68791382#68791382
 * @param {} str
 */
function preciseStringSizeNode(str: string): number {
	return 12 + 4 * Math.ceil(str.length / 4);
}

/**
 * In the browser environment, window and document are defined as global objects
 * @returns true if its a Node.js env, false if it is a browser
 */
function isNodeEnvironment(): boolean {
	if (typeof window !== 'undefined' && typeof document !== 'undefined') {
		return false;
	}
	return true;
}

function getSizeOfTypedArray(typedArray: any): number {
	if (typedArray.BYTES_PER_ELEMENT) {
		return typedArray.length * typedArray.BYTES_PER_ELEMENT;
	}
	return -1; // error indication
}

/**
 * Size in bytes for complex objects
 * @param {*} obj
 * @returns size in bytes, or -1 if JSON.stringify threw an exception
 */
function objectSizeComplex(obj: unknown): number {
	let totalSize = 0;
	const errorIndication = -1;

	try {
		// convert Map and Set to an object representation
		let convertedObj = obj;
		if (obj instanceof Map) {
			convertedObj = Object.fromEntries(obj);
		} else if (obj instanceof Set) {
			convertedObj = Array.from(obj);
		}

		// handle typed arrays
		if (ArrayBuffer.isView(obj)) {
			return getSizeOfTypedArray(obj as any);
		}

		const serializedObj = JSON.stringify(convertedObj, (key, value) => {
			if (typeof value === 'bigint') {
				return value.toString();
			} else if (typeof value === 'function') {
				return value.toString();
			} else if (typeof value === 'undefined') {
				return 'undefined';
			} else if (typeof value === 'symbol') {
				return value.toString();
			} else if (value instanceof RegExp) {
				return value.toString();
			} else {
				return value;
			}
		});

		totalSize = Buffer.byteLength(serializedObj, 'utf8');
	} catch (ex) {
		console.error('Error detected, returning ' + errorIndication, ex);
		return errorIndication;
	}

	return totalSize;
}

/**
 * Size in bytes for primitive types
 * @param {*} obj
 * @returns size in bytes
 */
function objectSizeSimple(obj: any): number {
	const objectList = [];
	const stack = [obj];
	let bytes = 0;

	while (stack.length) {
		const value = stack.pop();

		if (typeof value === 'boolean') {
			bytes += ECMA_SIZES.BYTES;
		} else if (typeof value === 'string') {
			if (isNodeEnvironment()) {
				bytes += preciseStringSizeNode(value);
			} else {
				bytes += value.length * ECMA_SIZES.STRING;
			}
		} else if (typeof value === 'number') {
			bytes += ECMA_SIZES.NUMBER;
		} else if (typeof value === 'symbol') {
			const isGlobalSymbol = Symbol.keyFor && Symbol.keyFor(obj);
			if (isGlobalSymbol) {
				bytes += Symbol.keyFor(obj)!.length * ECMA_SIZES.STRING;
			} else {
				bytes += (obj.toString().length - 8) * ECMA_SIZES.STRING;
			}
		} else if (typeof value === 'bigint') {
			bytes += Buffer.from(value.toString()).byteLength;
		} else if (typeof value === 'function') {
			bytes += value.toString().length;
		} else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
			objectList.push(value);

			for (const i in value) {
				stack.push(value[i]);
			}
		}
	}
	return bytes;
}

function sizeof(obj: NonNullable<unknown>): number {
	let totalSize = 0;

	if (obj !== null && typeof obj === 'object') {
		totalSize = objectSizeComplex(obj);
	} else {
		totalSize = objectSizeSimple(obj);
	}

	return totalSize;
}

export default sizeof;
