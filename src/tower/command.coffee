Tower.Command = 
  run: (argv) ->
    command = argv[2]
    throw new Error("You must give tower a command (e.g. 'tower new my-app' or 'tower server')") unless command
    command = new Tower.Command[Tower.Support.String.camelize(command)](argv)
    command.run()

require './command/generate'
require './command/new'
require './command/server'

module.exports = Tower.Command
