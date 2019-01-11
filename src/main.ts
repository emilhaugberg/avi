import { Terminal } from 'xterm';
import * as command from './commands';

const ENTER = 13;
const BACKSPACE = 8;

const term = new Terminal();
const terminalHtml = document.getElementById("terminal");

const commands = {
  "help": command.help,
  "invalid": command.invalid,
  "hello": command.hello
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
writeText(commands.hello);
term.write("$> ")
term.focus();

/* Typing. */
term.on('key', (key, ev) => {
  if (ev.keyCode >= 37 && ev.keyCode <= 40) {
    ev.preventDefault();
    return;
  }

  if (ev.keyCode == ENTER) {
    term.writeln("");
    var currCommand = state.command.toLowerCase()
    if (currCommand == "clear") {
      term.clear();
    } else {
      var message = !commands[currCommand] ? commands.invalid : commands[currCommand];
      writeText(message);
    }

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
    state.cursIndex++
    term.write(key)
  }
});
