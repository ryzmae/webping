import * as chalk from 'chalk';
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

    
}