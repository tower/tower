class Tower.Command.New  
  constructor: (argv) ->
    @program = require('commander')
    
    @program
      .option('-f, --float <n>', 'A float argument', parseFloat)
      .parse(argv)
  
  run: ->
    Tower.Generator.run("application")

module.exports = Tower.Command.New
