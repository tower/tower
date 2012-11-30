var command;

module.exports = command = function(argv) {
  var program;
  program = require('commander');
  program.version(Tower.version).usage('[command] [options]').on('--help', function() {
    return console.log('\ \ Commands:\n\ \ \n\ \   tower new <app-name>          generate a new Tower application in folder "app-name"\n\ \   tower console                 command line prompt to your application\n\ \   tower generate <generator>    generate project files (models, views, controllers, scaffolds, etc.)');
  });
  program.parse(argv);
  return program.helpIfNecessary(2);
};
