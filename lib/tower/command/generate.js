
  Tower.Command.Generate = (function() {

    function Generate(argv) {
      this.program = require('commander');
      this.program.option('-e, --environment [value]', 'output parsed comments for debugging').option('-i, --integer <n>', 'An integer argument', parseInt).option('-f, --float <n>', 'A float argument', parseFloat).parse(argv);
    }

    Generate.prototype.run = function() {};

    return Generate;

  })();

  module.exports = Tower.Command.Generate;
