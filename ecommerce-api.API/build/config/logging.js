"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCallingFunction = getCallingFunction;
exports.log = log;
exports.info = info;
exports.warn = warn;
exports.error = error;
const db_1 = require("./db");
// Define ANSI escape codes for console colors and styles
const colours = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m",
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        crimson: "\x1b[48m",
    },
};
// Function to get the name of the calling function from the error stack
function getCallingFunction(error) {
    try {
        const stack = error.stack;
        if (stack === undefined)
            return "--";
        // Extract the third line of the stack trace (index 2)
        const line = stack.split("\n")[2];
        // Use regex to match the function name
        const regex = /^.*at\s([a-zA-Z]+).*$/;
        const groups = line.match(regex);
        if (groups === null || groups.length < 2)
            return "--";
        return groups[1];
    }
    catch {
        return "--";
    }
}
// Custom logging functions that only log in non-QA and non-PRODUCTION environments
// General log function
function log(message, ...optionalParams) {
    if (!db_1.QA && !db_1.PRODUCTION)
        console.log(`[${new Date().toLocaleString()}]`, colours.fg.magenta, "[SERVER-LOG] ", colours.reset, message, ...optionalParams);
}
// Info log function with cyan color and calling function name
function info(message, ...optionalParams) {
    if (!db_1.QA && !db_1.PRODUCTION)
        console.info(`[${new Date().toLocaleString()}]`, colours.fg.cyan, "[INFO]", colours.reset, colours.bg.green, `[${getCallingFunction(new Error())}]`, colours.reset, message, ...optionalParams);
}
// Warning log function with yellow color and calling function name
function warn(message, ...optionalParams) {
    if (!db_1.QA && !db_1.PRODUCTION)
        console.warn(`[${new Date().toLocaleString()}]`, colours.fg.yellow, "[WARN]", colours.reset, colours.bg.green, `[${getCallingFunction(new Error())}]`, colours.reset, message, ...optionalParams);
}
// Error log function with red color and calling function name
function error(message, ...optionalParams) {
    if (!db_1.QA && !db_1.PRODUCTION)
        console.error(`[${new Date().toLocaleString()}]`, colours.fg.red, "[ERROR]", colours.reset, colours.bg.green, `[${getCallingFunction(new Error())}]`, colours.reset, message, ...optionalParams);
}
// Create a logging object with all logging functions
const logging = {
    log,
    info,
    warn,
    error,
    warning: warn,
    getCallingFunction,
};
// Attach the logging object to the global scope
globalThis.logging = logging;
exports.default = logging;
