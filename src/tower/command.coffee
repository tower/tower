Tower.Command = 
  # tower -v
  # tower --help
  # tower
  run: (argv) ->
    command = argv[2]
    command = "info" if !command || !!command.match(/^-/)
    #throw new Error("You must give tower a command (e.g. 'tower new my-app' or 'tower server')") unless command
    command = new Tower.Command[Tower.Support.String.camelize(command)](argv)
    command.run()

require './command/console'
require './command/generate'
require './command/info'
require './command/new'
require './command/server'

module.exports = Tower.Command
