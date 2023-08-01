import { createCanvas, type Canvas, type CanvasRenderingContext2D } from 'canvas';
import fs from 'node:fs';
import { promisify } from 'node:util';
import { MelMatrix } from './spectrogram.schema.js';

const writeFile = promisify(fs.writeFile);

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
		this.#canvas = createCanvas(this.width, this.height);
		this.#canvasContext = this.#canvas.getContext('2d');
	}

	/**
	 * The spectrogram data in its raw form. A 2D array of 8-bit numbers.
	 */
	readonly data: MelMatrix;
	readonly #canvas: Canvas;
	readonly #canvasContext: CanvasRenderingContext2D;

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

	/**
	 * Get the spectrogram as a canvas.
	 */
	get canvas(): Canvas {
		const imageData = this.#canvasContext.createImageData(this.width, this.height);

		imageData.data.set(new Uint8ClampedArray(this.rgba.flat(2)));

		this.#canvasContext.putImageData(imageData, 0, 0);

		return this.#canvas;
	}

	/**
	 * Get the spectrogram as a PNG buffer.
	 *
	 * The image is not altered or processed in any way, it is simply an interpretation of the raw data.
	 */
	get png(): Buffer {
		return this.canvas.toBuffer('image/png');
	}

	/**
	 * Save the spectrogram PNG to disk.
	 *
	 * The image is not altered or processed in any way, it is simply an interpretation of the raw data.
	 *
	 * @param location The location to save the spectrogram to.
	 * @returns A promise that resolves when the spectrogram has been saved.
	 */
	toDisk(location: `${string}.png`): Promise<void> {
		return writeFile(location, this.png);
	}
}
