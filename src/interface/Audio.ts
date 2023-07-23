import { type AudioFile } from '../services/audioFile/AudioFile.js';

export interface Audio {
	url: URL;
	audioFile: AudioFile;
}
