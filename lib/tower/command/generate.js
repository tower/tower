
Tower.Command.Generate = (function() {

  function Generate(argv) {
    this.program = require('commander');
    this.program.option('-e, --environment [value]', 'output parsed comments for debugging').parse(argv);
  }

  Generate.prototype.run = function() {
    return Tower.Generator.run("" + this.project.args[0] + "Generator", {
      program: this.program,
      modelName: this.program.args[2]
    });
  };

  return Generate;

})();

module.exports = Tower.Command.Generate;
