(function() {

  Tower.Command.Server = (function() {

    function Server(argv) {
      var program;
      this.program = program = require('commander');
      program.version(Tower.version).option('-e, --environment [value]', 'sets Tower.env (development, production, test, etc.)').option('-p, --port <n>', 'port for the application').option('--static', 'disable-watch').option('-v, --version').option('-h, --help', '\ \ Usage:\n\ \   tower server [options]\n\ \ \n\ \ Options:\n\ \   -e, --environment [value]         sets Tower.env (development, production, test, etc., default: development)\n\ \   -p, --port                        port for the application, default: 3000\n\ \   -h, --help                        output usage information\n\ \   -v, --version                     output version number\n\ \ \n\ \ Examples:\n\ \   tower generate scaffold Post title:string body:text belongsTo:user\n\ \   tower generate model Post title:string body:text belongsTo:user\n\ \ ');
      program.parse(argv);
      program.help || (program.help = program.rawArgs.length === 3);
      if (program.help) {
        console.log(program.options[program.options.length - 1].description);
        process.exit();
      }
    }

    Server.prototype.run = function() {
      var program;
      program = this.program;
      Tower.watch = !!!program.static;
      Tower.env = program.environment || "development";
      Tower.port = program.port = program.port ? parseInt(program.port) : process.env.PORT || 3000;
      return Tower.Application.instance().run();
    };

    return Server;

  })();

  module.exports = Tower.Command.Server;

}).call(this);
