var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.CommandInfo = (function() {

  function CommandInfo(argv) {
    var program;
    this.program = program = require('commander');
    program.version(Tower.version).option('-v, --version').option('-h, --help', '\ \ Usage:\n\ \   tower [command] [options]\n\ \ \n\ \ Commands:\n\ \   new <app-name>                    generate a new Tower application in folder "app-name"\n\ \   console                           command line prompt to your application\n\ \   generate <generator>              generate project files (models, views, controllers, scaffolds, etc.)\n\ \ \n\ \ Options:\n\ \   -h, --help                        output usage information\n\ \   -v, --version                     output version number\n\ \ ');
    program.parse(argv);
    program.help || (program.help = program.rawArgs.length === 2);
    if (program.help) {
      console.log(program.options[program.options.length - 1].description);
      process.exit();
    }
  }

  __defineProperty(CommandInfo,  "run", function() {});

  return CommandInfo;

})();

module.exports = Tower.CommandInfo;
