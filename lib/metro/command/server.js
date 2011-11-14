(function() {
  Metro.Command.Server = (function() {
    function Server(argv) {
      var program;
      this.program = program = require('commander');
      program.option('-e, --environment [value]', 'output parsed comments for debugging').option('-p, --port <n>', 'port for the application', parseInt).parse(argv);
    }
    Server.prototype.run = function() {};
    return Server;
  })();
  module.exports = Metro.Command.Generate;
}).call(this);
