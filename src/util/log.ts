import chalk from 'chalk';

let enabled = false;

// Dead simple production logging
// For debugging, just use console.log or a debugger! 🤣

export function error(message: string): void {
	if (enabled) {
		console.error(`${chalk.black(chalk.bgRed(' ERROR '))} ${message}`);
	}
}

export function success(message: string): void {
	if (enabled) {
		console.log(`${chalk.black(chalk.bgGreen(' SUCCESS '))} ${message}`);
	}
}

export function info(message: string): void {
	if (enabled) {
		console.info(`${chalk.black(chalk.bgBlue(' INFO '))} ${message}`);
	}
}

export function warn(message: string): void {
	if (enabled) {
		console.warn(`${chalk.black(chalk.bgYellow(' WARN '))} ${message}`);
	}
}

export function http(url: URL): void {
	if (enabled) {
		console.log(`${chalk.black(chalk.bgWhite(` HTTP ${url.host} `))} ${url.pathname}`);
	}
}

export function setLogging(option: boolean): void {
	enabled = option;
}
