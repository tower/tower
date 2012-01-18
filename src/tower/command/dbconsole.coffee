# http://nodejs.org/docs/v0.6.1/api/repl.html
class Tower.Command.DBConsole
  constructor: (argv) ->
    @program = require('commander')
    
    @program
      .option('-e, --environment [value]', 'output parsed comments for debugging')
      .parse(argv)
  
  run: ->
    client = require("repl").start("mongo> ").context
  
module.exports = Tower.Command.DBConsole
