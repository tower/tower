var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.CommandGenerate = (function() {

  function CommandGenerate(argv) {
    var program;
    this.program = program = new (require('commander').Command);
    program.version(Tower.version).usage('generate <generator> <name> [attributes] [options]').on('--help', function() {
      return console.log('\ \ Generators:\n\ \ \n\ \   tower generate scaffold <name> [attributes] [options]   generate model, views, and controller\n\ \   tower generate model <name> [attributes] [options]      generate a model\n\ \ \n\ \ Examples:\n\ \ \n\ \   tower generate scaffold Post title:string body:text belongsTo:user\n\ \   tower generate model Post title:string body:text belongsTo:user\n\ \ ');
    });
    program.parse(argv);
    program.helpIfNecessary(4);
  }

  __defineProperty(CommandGenerate,  "run", function() {
    return Tower.Generator.run(this.program.args[1], {
      program: this.program,
      modelName: this.program.args[2]
    });
  });

  return CommandGenerate;

})();

module.exports = Tower.CommandGenerate;
