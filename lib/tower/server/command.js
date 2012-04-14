
Tower.Command = {
  aliases: {
    c: "console",
    g: "generate",
    s: "server"
  },
  run: function(argv) {
    var command;
    command = argv[2];
    if (!command || !!command.match(/^-/)) {
      command = "info";
    }
    if (this.aliases.hasOwnProperty(command)) {
      command = this.aliases[command];
    }
    command = new Tower.Command[Tower.Support.String.camelize(command)](argv);
    return command.run();
  }
};

require('./command/console');

require('./command/generate');

require('./command/info');

require('./command/new');

require('./command/server');

module.exports = Tower.Command;
