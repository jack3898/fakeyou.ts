import { type Canvas, type CanvasRenderingContext2D, createCanvas } from 'canvas';
import { MelMatrix } from './spectrogram.schema.js';
import fs from 'node:fs';
import { promisify } from 'node:util';

const writeFile = promisify(fs.writeFile);

export type RGBA = [number, number, number, number];

export class Spectrogram {
	constructor(data: MelMatrix) {
		this.data = data;
		this.#canvas = createCanvas(this.width, this.height);
		this.#canvasContext = this.#canvas.getContext('2d');
	}

	readonly data: MelMatrix;
	readonly #canvas: Canvas;
	readonly #canvasContext: CanvasRenderingContext2D;

	get width(): number {
		return this.data[0].length;
	}

	get height(): number {
		return this.data.length;
	}

	get rgba(): RGBA[][] {
		return this.data.map((row) => row.map((col): RGBA => [col, col, col, 255]));
	}

	get canvas(): Canvas {
		const imageData = this.#canvasContext.createImageData(this.width, this.height);

		imageData.data.set(new Uint8ClampedArray(this.rgba.flat(2)));

		this.#canvasContext.putImageData(imageData, 0, 0);

		return this.#canvas;
	}

	get png(): Buffer {
		return this.canvas.toBuffer('image/png');
	}

	toDisk(location: `${string}.png`): Promise<void> {
		return writeFile(location, this.png);
	}
}
