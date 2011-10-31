class Metro.Command.Generate
  constructor: (argv) ->
    @program = require('commander')
    
    @program
      .option('-e, --environment [value]', 'output parsed comments for debugging')
      .option('-i, --integer <n>', 'An integer argument', parseInt)
      .option('-f, --float <n>', 'A float argument', parseFloat)
      .parse(argv)
  
  run: ->
  
module.exports = Generate
