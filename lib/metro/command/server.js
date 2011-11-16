(function() {
  Metro.Command.Server = (function() {
    function Server(argv) {
      var program;
      this.program = program = require('commander');
      program.option('-e, --environment [value]', 'output parsed comments for debugging').option('-p, --port <n>', 'port for the application').parse(argv);
    }
    Server.prototype.run = function() {
      var program;
      program = this.program;
      Metro.env = program.environment || "development";
      Metro.port = program.port = program.port ? parseInt(program.port) : process.env.PORT || 1597;
      Metro.Application.initialize();
      return Metro.Application.run();
    };
    return Server;
  })();
  module.exports = Metro.Command.Server;
}).call(this);
