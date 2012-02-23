
Tower.Command = {
  run: function(argv) {
    var command;
    command = argv[2];
    if (!!command.match(/^-/)) command = "server";
    if (!command) {
      throw new Error("You must give tower a command (e.g. 'tower new my-app' or 'tower server')");
    }
    command = new Tower.Command[Tower.Support.String.camelize(command)](argv);
    return command.run();
  }
};

require('./command/console');

require('./command/generate');

require('./command/new');

require('./command/server');

module.exports = Tower.Command;
