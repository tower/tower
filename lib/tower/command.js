
Tower.Command = {
  run: function(argv) {
    var command;
    command = argv[2];
    if (!command || !!command.match(/^-/)) command = "info";
    command = new Tower.Command[Tower.Support.String.camelize(command)](argv);
    return command.run();
  }
};

require('./command/config');

require('./command/console');

require('./command/generate');

require('./command/info');

require('./command/new');

require('./command/server');

module.exports = Tower.Command;
