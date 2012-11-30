var _;

_ = Tower._;

require('commander').Command.prototype.helpIfNecessary = function(length) {
  if ((length && this.rawArgs.length === length) || this.rawArgs.indexOf('--help') > -1 || this.rawArgs.indexOf('-h') > -1) {
    this.outputHelp();
    return process.exit();
  }
};

Tower.Command = {
  load: function(name) {
    return require("./" + name);
  },
  aliases: {
    c: 'console',
    g: 'generate',
    s: 'server'
  },
  run: function(argv) {
    var command, fn;
    command = argv[2];
    if (!command || !!command.match(/^-/)) {
      command = 'info';
    }
    if (command === 'select') {
      command = 'database';
      argv.splice(2, 1, 'database', 'list');
    }
    if (this.aliases.hasOwnProperty(command)) {
      command = this.aliases[command];
    }
    switch (command) {
      case 'install':
        return 'x';
      case 'exec':
        return this.exec(argv[3]);
      default:
        fn = Tower.Command.load(command);
        if (command === 'info') {
          return fn(argv);
        } else {
          command = new Tower['Command' + _.camelize(command)](argv);
          return command.run();
        }
    }
  }
};

module.exports = Tower.Command;
