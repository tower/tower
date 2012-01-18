# https://github.com/remy/nodemon
class Tower.Command.Server
  constructor: (argv) ->
    @program = program = require('commander')
    
    program
      .option('-e, --environment [value]', 'output parsed comments for debugging')
      .option('-p, --port <n>', 'port for the application')
      .parse(argv)
  
  run: ->
    program     = @program
    Tower.env   = program.environment || "development"
    Tower.port  = program.port      = if program.port then parseInt(program.port) else (process.env.PORT || 1597)
    
    Tower.Application.instance().run()
  
module.exports = Tower.Command.Server
