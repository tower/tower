
Tower.Command.Generate = (function() {

  function Generate(argv) {
    var program;
    this.program = program = new (require('commander').Command);
    program.version(Tower.version).option('-v, --version').option('-h, --help', '\ \ Usage:\n\ \   tower generate <generator> <name> [attributes] [options]\n\ \ \n\ \ Generators:\n\ \   tower generate scaffold <name> [attributes] [options]   generate model, views, and controller\n\ \   tower generate model <name> [attributes] [options]      generate a model\n\ \ \n\ \ Options:\n\ \   -h, --help                        output usage information\n\ \   -v, --version                     output version number\n\ \ \n\ \ Examples:\n\ \   tower generate scaffold Post title:string body:text belongsTo:user\n\ \   tower generate model Post title:string body:text belongsTo:user\n\ \ ');
    program.parse(argv);
    program.help || (program.help = program.rawArgs.length === 3);
    if (program.help) {
      console.log(program.options[program.options.length - 1].description);
      process.exit();
    }
  }

  Generate.prototype.run = function() {
    return Tower.Generator.run(this.program.args[1], {
      program: this.program,
      modelName: this.program.args[2]
    });
  };

  return Generate;

})();

module.exports = Tower.Command.Generate;
