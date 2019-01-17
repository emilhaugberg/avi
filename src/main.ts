import { Terminal } from 'xterm';
import * as commands from './commands.json';
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
import * as fit from 'xterm/lib/addons/fit/fit';

Terminal.applyAddon(fullscreen);
Terminal.applyAddon(fit);

const ENTER = 13;
const BACKSPACE = 8;

let term = new Terminal();

var state = {
  command: "",
  line: "$> ",
  cursIndex: 0
}

/* Nasty hack. */
function animated_intro(text) {
  var i = 0;

  setTimeout(function f(){
    if (i >= text.length) {
      term.write("$> ")
      term.focus();
      return;
    }

    if (text.charAt(i) == "\n") {
      term.writeln("");
    } else {
      term.write(text.charAt(i));
    }

    i++

    setTimeout(f, 25);
  }, 25);
}

/* Initializes the terminal and focuses the cursor on load. */
function initialize() {
  term.open(document.getElementById("terminal"));
  fullscreen.toggleFullScreen(term, true);
  fit.fit(term)
  animated_intro((<any>commands).hello.default);
}

/* Writes text to the terminal. */
function writeText(command) {
  var fl = getFlags(command);

  var c = command.split(" ")[0];
  if (!(<any>commands).default[c]) {
    term.writeln(commands["invalid"]["default"]);
    return;
  }

  if (fl.length == 0) {
    var text = (<any>commands).default[c]["default"];

    text.split("\n").forEach(function(line) {
      term.writeln(line);
    });
    return;
  }

  var allowedFlags = Object.keys((<any>commands).default[c]["flags"]);

  var illegal_flag = false;
  fl.forEach(function(flag) {
    if (allowedFlags.indexOf(flag) == -1) {
      illegal_flag = true;
      term.writeln(commands["invalid"]["default"]);
      return;
    }
  })

  if (illegal_flag) {
    return;
  }

  fl.forEach(function(flag) {
    term.writeln(commands["default"][c]["flags"][flag]);
  })
}

function getFlags(str) {
  var reg = /(--([a-zA-Z0-9]+)*)/g
  var flags = []
  var match = reg.exec(str);

  while (match != null) {
    flags.push(match[0].substring(2));
    match = reg.exec(str);
  }

  return flags;
}

/* Called when a user presses enter. */
function enterPress() {
  term.writeln("");
  var currCommand = state.command.toLowerCase()
  if (currCommand == "clear") {
    term.clear();
  } else {
    writeText(currCommand);
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
