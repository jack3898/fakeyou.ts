export interface AudioFile {
	url: URL;
	updatedAt: Date;
	createdAt: Date;
	toBuffer: () => Promise<Buffer | null>;
	toBase64: () => Promise<string | null>;
	toDisk: (location: `${string}.wav`) => Promise<void>;
}
