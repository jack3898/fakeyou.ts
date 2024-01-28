import { type MelMatrix } from './spectrogram.schema.js';

/**
 * A RGBA color, represented as an array of 4 8-bit numbers (0-255) in the order [red, green, blue, alpha].
 */
export type RGBA = [number, number, number, number];

/**
 * A spectrogram is a visual representation of the spectrum of frequencies of a signal as it varies with time.
 * This class represents a spectrogram as a 2D array of 8-bit numbers received from the API.
 * It can be converted to a canvas or PNG buffer, or saved to disk.
 * It is not altered or processed in any way, it is simply an interpretation of the raw data so you can do with it as you please.
 */
export class Spectrogram {
	/**
	 * @param data The spectrogram data in its raw form. A 2D array of 8-bit numbers.
	 */
	constructor(data: MelMatrix) {
		this.data = data;
	}

	/**
	 * The spectrogram data in its raw form. A 2D array of 8-bit numbers.
	 */
	readonly data: MelMatrix;

	/**
	 * Get the width of the spectrogram output.
	 */
	get width(): number {
		return this.data[0].length;
	}

	/**
	 * Get the height of the spectrogram output.
	 */
	get height(): number {
		return this.data.length;
	}

	get rgba(): RGBA[][] {
		return this.data.map((row) => row.map((col): RGBA => [col, col, col, 255]));
	}
}
