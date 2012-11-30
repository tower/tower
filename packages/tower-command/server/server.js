var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.CommandServer = (function() {

  function CommandServer(argv) {
    var program;
    this.program = program = require('commander');
    program.version(Tower.version).usage('server [options]').option('-e, --environment [value]', 'sets Tower.env (development, production, test, etc.)').option('-p, --port <n>', 'port for the application').option('--static', 'disable-watch').option('--single', 'Single page app').option('-v, --version').on('--help', function() {
      return console.log('\ \ Examples:\n\ \   tower generate scaffold Post title:string body:text belongsTo:user\n\ \   tower generate model Post title:string body:text belongsTo:user');
    });
    program.parse(argv);
    program.helpIfNecessary();
    Tower.isSinglePage = !!program.single;
  }

  __defineProperty(CommandServer,  "run", function() {
    var port, program;
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
    port = parseInt(program.port) || process.env.PORT || process.env.port || 3000;
    Tower.port = program.port = process.env.PORT = process.env.port = port;
    Tower["is" + (_.camelize(Tower.env))] = true;
    return Tower.Application.instance().run();
  });

  return CommandServer;

})();

module.exports = Tower.CommandServer;
