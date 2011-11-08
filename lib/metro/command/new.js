(function() {
  Metro.Command.New = (function() {
    function New(argv) {
      this.program = require('commander');
      this.program.option('-e, --environment [value]', 'output parsed comments for debugging').option('-p, --port <n>', 'The port', parseInt).option('-f, --float <n>', 'A float argument', parseFloat).parse(argv);
    }
    New.prototype.run = function() {};
    return New;
  })();
  module.exports = Metro.Command.New;
}).call(this);
