export default class FakeYouError extends Error {
	constructor(message: string) {
		super(message);
	}
}
