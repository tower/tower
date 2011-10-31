class Metro.Command.New  
  constructor: (argv) ->
    @program = require('commander')
    
    @program
      .option('-e, --environment [value]', 'output parsed comments for debugging')
      .option('-p, --port <n>', 'The port', parseInt)
      .option('-f, --float <n>', 'A float argument', parseFloat)
      .parse(argv)
  
  run: ->

module.exports = Metro.Command.New
