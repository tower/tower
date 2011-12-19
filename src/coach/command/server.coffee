class Coach.Command.Server
  constructor: (argv) ->
    @program = program = require('commander')
    
    program
      .option('-e, --environment [value]', 'output parsed comments for debugging')
      .option('-p, --port <n>', 'port for the application')
      .parse(argv)
  
  run: ->
    program     = @program
    Coach.env   = program.environment || "development"
    Coach.port  = program.port      = if program.port then parseInt(program.port) else (process.env.PORT || 1597)
    
    Coach.Application.instance().run()
  
module.exports = Coach.Command.Server
