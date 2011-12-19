Coach.Command = 
  run: (argv) ->
    command = argv[2]
    command = Coach.Support.String.camelize(command)
    command = new Coach.Command[command](argv)
    command.run()

require './command/generate'
require './command/new'
require './command/server'

module.exports = Coach.Command
