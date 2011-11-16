Metro.Command = 
  run: (argv) ->
    command = argv[2]
    command = Metro.Support.String.camelize(command)
    command = new Metro.Command[command](argv)
    command.run()

require './command/generate'
require './command/new'
require './command/server'

module.exports = Metro.Command
