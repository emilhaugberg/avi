import { Terminal } from 'xterm';
import * as command from './commands';

const ENTER = 13;
const BACKSPACE = 8;

const term = new Terminal();
const terminalHtml = document.getElementById("terminal");

const commands = {
  "help": command.help,
  "invalid": command.invalid
}

function writeText(string) {
  string.split("\n").forEach((str) => {
    term.writeln(str)
  })
}

var state = {
  command: "",
  line: "$> ",
  cursIndex: 0
}

term.open(terminalHtml);
term.write(state.line);

/* Typing. */
term.on('key', (key, ev) => {
  if (ev.keyCode == ENTER) {
    term.writeln("");

    var message = !commands[state.command] ? commands.invalid : commands[state.command];
    writeText(message);
    state.command="";
    term.write("$> ")
    state.cursIndex = 0;
  } else if (ev.keyCode == BACKSPACE) {
    if (state.cursIndex > 0) {
      term.write("\b \b");
      state.command = state.command.length > 0 ? state.command.slice(0, -1) : state.command;
      state.cursIndex--;
    }
  } else {
    state.command = state.command.concat(key);
    state.line = state.line.concat(key);
    state.cursIndex++
    term.write(key)
  }
});
