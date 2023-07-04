import chalk from 'chalk';

let enabled = false;

// Dead simple production logging
// For debugging, just use console.log or a debugger! 🤣

export function error(message: string): void {
	if (enabled) {
		console.error(`${chalk.bgRed` ERROR `} ${message}`);
	}
}

export function success(message: string): void {
	if (enabled) {
		console.log(`${chalk.bgGreen` SUCCESS `} ${message}`);
	}
}

export function info(message: string): void {
	if (enabled) {
		console.info(`${chalk.bgBlue` INFO `} ${message}`);
	}
}

export function warn(message: string): void {
	if (enabled) {
		console.warn(`${chalk.bgYellow` WARN `} ${message}`);
	}
}

export function http(url: URL): void {
	if (enabled) {
		console.log(`${chalk.bgWhite(` HTTP ${url.host} `)} ${url.pathname}`);
	}
}

export function setLogging(option: boolean): void {
	enabled = option;
}
