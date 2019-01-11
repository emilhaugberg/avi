import { Terminal } from 'xterm';
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as command from './commands';

const ENTER = 13;
const BACKSPACE = 8;

Terminal.applyAddon(fullscreen);

let term = new Terminal();

const commands = {
  "help": command.help,
  "invalid": command.invalid,
  "hello": command.hello
}

var state = {
  command: "",
  line: "$> ",
  cursIndex: 0
}

/* Initializes the terminal and focuses the cursor on load. */
function initialize() {
  term.open(document.getElementById("terminal"));

  writeText(commands.hello);
  term.write("$> ")
  term.focus();
}

/* Writes text to the terminal. */
function writeText(string) {
  string.split("\n").forEach((str) => {
    term.writeln(str)
  })
}

/* Called when a user presses enter. */
function enterPress() {
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
}

/* Called when a user presses backspace. */
function backspacePress() {
  if (state.cursIndex > 0) {
    term.write("\b \b");
    state.command = state.command.length > 0 ? state.command.slice(0, -1) : state.command;
    state.cursIndex--;
  }
}

/* Typing. */
term.on('key', (key, ev) => {
  /* Disable navigating with cursor. */
  if (ev.keyCode >= 37 && ev.keyCode <= 40) {
    ev.preventDefault();
    return;
  }

  if (ev.keyCode == ENTER) {
    enterPress()
  } else if (ev.keyCode == BACKSPACE) {
    backspacePress()
  } else {
    state.command = state.command.concat(key);
    state.cursIndex++
    term.write(key)
  }
});

initialize();
