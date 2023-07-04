type DataInput = Parameters<(typeof Buffer)['from']>[0];

export function encode(string: DataInput): string {
	return Buffer.from(string).toString('base64');
}

export function decode(string: DataInput): string {
	return Buffer.from(string, 'base64').toString();
}
