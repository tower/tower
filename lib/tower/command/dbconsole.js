
Tower.Command.DBConsole = (function() {

  function DBConsole(argv) {
    this.program = require('commander');
    this.program.option('-e, --environment [value]', 'output parsed comments for debugging').parse(argv);
  }

  DBConsole.prototype.run = function() {
    var client;
    return client = require("repl").start("mongo> ").context;
  };

  return DBConsole;

})();

module.exports = Tower.Command.DBConsole;
