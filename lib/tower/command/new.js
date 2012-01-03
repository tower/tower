
Tower.Command.New = (function() {

  function New(argv) {
    this.program = require('commander');
    this.program.option('-f, --float <n>', 'A float argument', parseFloat).parse(argv);
  }

  New.prototype.run = function() {
    return Tower.Generator.run("application");
  };

  return New;

})();

module.exports = Tower.Command.New;
