
  Coach.Command = {
    run: function(argv) {
      var command;
      command = argv[2];
      command = Coach.Support.String.camelize(command);
      command = new Coach.Command[command](argv);
      return command.run();
    }
  };

  require('./command/generate');

  require('./command/new');

  require('./command/server');

  module.exports = Coach.Command;
