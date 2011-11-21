
  /*
  # Compiles your source files into code for the client!
  # 
  #
  */

  Metro.Command.Build = (function() {

    function Build(argv) {
      this.program = require('commander');
      this.program.option('-e, --environment [value]', 'output parsed comments for debugging').option('-i, --integer <n>', 'An integer argument', parseInt).option('-f, --float <n>', 'A float argument', parseFloat).parse(argv);
    }

    Build.prototype.run = function() {};

    return Build;

  })();

  module.exports = Metro.Command.Generate;
