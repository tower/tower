
Tower.Command = {
  aliases: {
    c: 'console',
    g: 'generate',
    s: 'server'
  },
  run: function(argv) {
    var command;
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
        command = new Tower['Command' + _.camelize(command)](argv);
        return command.run();
    }
  }
};

module.exports = Tower.Command;
