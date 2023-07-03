type DataInput = Parameters<(typeof Buffer)['from']>[0];

export function base64encode(string: DataInput): string {
	return Buffer.from(string).toString('base64');
}

export function base64decode(string: DataInput): string {
	return Buffer.from(string, 'base64').toString();
}
