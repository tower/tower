Metro.Command.Server = (function() {
  function Server(argv) {
    this.program = require('commander');
    this.program.option('-e, --environment [value]', 'output parsed comments for debugging').option('-i, --integer <n>', 'An integer argument', parseInt).option('-f, --float <n>', 'A float argument', parseFloat).parse(argv);
  }
  Server.prototype.run = function() {};
  return Server;
})();
module.exports = Server;