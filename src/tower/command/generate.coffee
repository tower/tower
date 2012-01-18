class Tower.Command.Generate
  constructor: (argv) ->
    @program = require('commander')
    
    @program
      .option('-e, --environment [value]', 'output parsed comments for debugging')
      .parse(argv)
  
  run: ->
    Tower.Generator.run("#{@project.args[0]}Generator", program: @program, modelName: @program.args[2])
  
module.exports = Tower.Command.Generate
