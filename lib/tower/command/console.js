
Tower.Command.Console = (function() {

  function Console(argv) {
    var program;
    this.program = program = require('commander');
    program.version(Tower.version).option('-e, --environment [value]').option('-h, --help', '\ \ Usage: \n\ \   tower console [options]\n\ \ \n\ \ Options:\n\ \   -e, --environment [value]         sets Tower.env (development, production, test, etc., default: development)\n\ \   -h, --help                        output usage information\n\ \   -v, --version                     output version number\n\ \   ');
    program.parse(argv);
    program.environment || (program.environment = "development");
    if (program.help) {
      console.log(program.options[program.options.length - 1].description);
      process.exit();
    }
  }

  Console.prototype.run = function() {
    var client;
    Tower.env = this.program.environment;
    client = require("repl").start("tower> ").context;
    client.reload = function() {
      var app;
      app = Tower.Application.instance();
      app.initialize();
      app.stack();
      client.Tower = Tower;
      client._ = _;
      return client[Tower.namespace()] = app;
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
