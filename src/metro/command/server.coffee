class Metro.Command.Server
  constructor: (argv) ->
    @program = program = require('commander')
    
    program
      .option('-e, --environment [value]', 'output parsed comments for debugging')
      .option('-p, --port <n>', 'port for the application', parseInt)
      .parse(argv)
  
  run: ->
  
module.exports = Metro.Command.Generate
