export interface AudioFile {
	url: URL;
	updatedAt: Date;
	createdAt: Date;
	toBuffer: () => Promise<Buffer | undefined>;
	toBase64: () => Promise<string | undefined>;
	toDisk: (location: `${string}.wav`) => Promise<void>;
}
