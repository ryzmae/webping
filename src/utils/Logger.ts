import chalk from 'chalk';
import moment from 'moment';

const logs = {
    Info: "   Info",
    Error: "  Error",
    Warn: "   Warn",
    Debug: "  Debug ",
}

export interface LoggerOptions {
    info?: boolean;
    error?: boolean;
    warn?: boolean;
    debug?: boolean;
}

export class Logger {
    private options: LoggerOptions = {
        info: true,
        error: true,
        warn: true,
        debug: true,
    };
    private spaces: string = chalk.magenta.bold(" :: ");
    private prefix: string = "Logger";
    constructor(options: LoggerOptions) {
        this.options = { ...this.options, ...options };
    }
    private GetDate() {
        return moment().format("DD/MM/YY HH:mm:ss");
    }
    
    info(...input: string[]) {
        if (!this.options.info) return;
        return console.log([
            chalk.gray.bold(this.GetDate()) + " ",
            this.prefix ? chalk.yellow.bold(this.prefix) : "",
            this.spaces,
            chalk.cyan.bold(logs.Info),
            chalk.cyan.bold("|| "),
            chalk.cyan.dim(input.flat().join(" "))
        ].join(""))
    }

    error(error: Error) {
        if (!this.options.error) return;
        return console.log([
            chalk.gray.bold(this.GetDate()) + " ",
            this.prefix ? chalk.yellow.bold(this.prefix) : "",
            this.spaces,
            chalk.red.bold(logs.Error),
            chalk.red.bold("|| "),
            chalk.red.dim((error.stack ? [error.stack] : [error.name, error.message]).filter(Boolean).map(v => v.toString()).join("\n"))
        ].join(""))
    }

    debug(...input: string[]) {
        if (!this.options.debug) return;
        return console.log([
            chalk.gray.bold(this.GetDate()) + " ",
            this.prefix ? chalk.yellow.bold(this.prefix) : "",
            this.spaces,
            chalk.gray.bold(logs.Debug),
            chalk.gray.bold("|| "),
            chalk.gray.dim(input.flat().join(" "))
        ].join(""))
    }

    warn(...input: string[]) {
        if (!this.options.warn) return;
        return console.log([
            chalk.gray.bold(this.GetDate()) + " ",
            this.prefix ? chalk.yellow.bold(this.prefix) : "",
            this.spaces,
            chalk.redBright.bold(logs.Warn),
            chalk.redBright.bold("|| "),
            chalk.redBright.dim(input.flat().join(" "))
        ].join(""))
    }

}