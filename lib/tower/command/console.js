
Tower.Command.Console = (function() {

  function Console(argv) {
    this.program = require('commander');
    this.program.option('-e, --environment [value]', 'output parsed comments for debugging').parse(argv);
  }

  Console.prototype.run = function() {
    var client;
    client = require("repl").start("tower> ").context;
    client.reload = function() {
      return client.Tower = Tower;
    };
    client._c = function() {
      var i, l, message;
      l = arguments.length;
      message = "Callback called with " + l + " argument" + (l === 1 ? "" : "s") + (l > 0 ? ":\n" : "");
      i = 0;
      while (i < 10) {
        if (i < arguments.length) {
          client["_" + i] = arguments[i];
          message += "_" + i + " = " + arguments[i] + "\n";
        } else {
          if (client.hasOwnProperty("_" + i)) delete client["_" + i];
        }
        i++;
      }
      return console.log(message);
    };
    client.exit = function() {
      return process.exit(0);
    };
    return process.nextTick(client.reload);
  };

  return Console;

})();

module.exports = Tower.Command.Console;
