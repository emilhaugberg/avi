"use strict";
exports.__esModule = true;
var xterm_1 = require("xterm");
var command = require("./commands");
var ENTER = 13;
var BACKSPACE = 8;
var term = new xterm_1.Terminal();
var terminalHtml = document.getElementById("terminal");
var commands = {
    "help": command.help,
    "invalid": command.invalid
};
function writeText(string) {
    string.split("\n").forEach(function (str) {
        term.writeln(str);
    });
}
var state = {
    command: "",
    line: "$> ",
    cursIndex: 0
};
term.open(terminalHtml);
writeText(commands.hello);
writeText(state.line);
/* Typing. */
term.on('key', function (key, ev) {
    if (ev.keyCode == ENTER) {
        term.writeln("");
        var message = !commands[state.command] ? commands.invalid : commands[state.command];
        writeText(message);
        state.command = "";
        term.write("$> ");
        state.cursIndex = 0;
    }
    else if (ev.keyCode == BACKSPACE) {
        if (state.cursIndex > 0) {
            term.write("\b \b");
            state.command = state.command.length > 0 ? state.command.slice(0, -1) : state.command;
            state.cursIndex--;
        }
    }
    else {
        state.command = state.command.concat(key);
        state.line = state.line.concat(key);
        state.cursIndex++;
        term.write(key);
    }
});
