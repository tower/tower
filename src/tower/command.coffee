Tower.Command = 
  run: (argv) ->
    command = argv[2]
    command = Tower.Support.String.camelize(command)
    command = new Tower.Command[command](argv)
    command.run()

require './command/generate'
require './command/new'
require './command/server'

module.exports = Tower.Command
