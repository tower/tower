
  Tower.Command = {
    run: function(argv) {
      var command;
      command = argv[2];
      command = Tower.Support.String.camelize(command);
      command = new Tower.Command[command](argv);
      return command.run();
    }
  };

  require('./command/generate');

  require('./command/new');

  require('./command/server');

  module.exports = Tower.Command;
