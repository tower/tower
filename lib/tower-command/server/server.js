var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.CommandServer = (function() {

  function CommandServer(argv) {
    var program;
    this.program = program = require('commander');
    program.version(Tower.version).option('-e, --environment [value]', 'sets Tower.env (development, production, test, etc.)').option('-p, --port <n>', 'port for the application').option('--static', 'disable-watch').option('--single', 'Single page app').option('-v, --version').option('-h, --help', '\ \ Usage:\n\ \   tower server [options]\n\ \ \n\ \ Options:\n\ \   -e, --environment [value]         sets Tower.env (development, production, test, etc., default: development)\n\ \   -p, --port                        port for the application, default: 3000\n\ \   -h, --help                        output usage information\n\ \   -v, --version                     output version number\n\ \ \n\ \ Examples:\n\ \   tower generate scaffold Post title:string body:text belongsTo:user\n\ \   tower generate model Post title:string body:text belongsTo:user\n\ \ ');
    program.parse(argv);
    program.help || (program.help = program.rawArgs.length === 3);
    Tower.isSinglePage = !!program.single;
    if (program.help) {
      console.log(program.options[program.options.length - 1].description);
      process.exit();
    }
  }

  __defineProperty(CommandServer,  "run", function() {
    var program;
    program = this.program;
    Tower.env = program.environment || process.env.NODE_ENV || "development";
    process.env.NODE_ENV = Tower.env;
    if (!!program["static"]) {
      Tower.watch = false;
    } else if (Tower.env !== 'development') {
      Tower.watch = false;
    } else {
      Tower.watch = true;
    }
    Tower.lazyLoadApp = Tower.env === 'development';
    Tower.port = program.port = program.port ? parseInt(program.port) : process.env.PORT || 3000;
    Tower["is" + (_.camelize(Tower.env))] = true;
    return Tower.Application.instance().run();
  });

  return CommandServer;

})();

module.exports = Tower.CommandServer;
