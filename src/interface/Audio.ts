import { type AudioFile } from '../services/audioFile/AudioFile.js';

export interface Audio {
	url: string;
	audioFile: AudioFile;
}
