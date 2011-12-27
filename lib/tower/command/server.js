
  Tower.Command.Server = (function() {

    function Server(argv) {
      var program;
      this.program = program = require('commander');
      program.option('-e, --environment [value]', 'output parsed comments for debugging').option('-p, --port <n>', 'port for the application').parse(argv);
    }

    Server.prototype.run = function() {
      var program;
      program = this.program;
      Tower.env = program.environment || "development";
      Tower.port = program.port = program.port ? parseInt(program.port) : process.env.PORT || 1597;
      return Tower.Application.instance().run();
    };

    return Server;

  })();

  module.exports = Tower.Command.Server;
