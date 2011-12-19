
  Coach.Command.Server = (function() {

    function Server(argv) {
      var program;
      this.program = program = require('commander');
      program.option('-e, --environment [value]', 'output parsed comments for debugging').option('-p, --port <n>', 'port for the application').parse(argv);
    }

    Server.prototype.run = function() {
      var program;
      program = this.program;
      Coach.env = program.environment || "development";
      Coach.port = program.port = program.port ? parseInt(program.port) : process.env.PORT || 1597;
      return Coach.Application.instance().run();
    };

    return Server;

  })();

  module.exports = Coach.Command.Server;
