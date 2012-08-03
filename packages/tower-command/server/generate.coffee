class Tower.Command.Generate
  constructor: (argv) ->
    @program = program = new (require('commander').Command)

    # tower generate template
    # tower generate model
    # tower generate library # a plugin/module/extension
    # @todo Need to implement these options
    #
    # @example --controller option for defining belongsTo
    #   tower generate scaffold Comment body:string belongsTo:user belongsTo:post --controller belongsTo:user,post
    #
    # @example --seed 20 (or without number, generates default of 100, enough to explore pagination)
    #   tower generate scaffold Comment body:string --seed 100
    program
      .version(Tower.version)
      .option('-v, --version')
      .option '-h, --help', '''
\ \ Usage:
\ \   tower generate <generator> <name> [attributes] [options]
\ \ 
\ \ Generators:
\ \   tower generate scaffold <name> [attributes] [options]   generate model, views, and controller
\ \   tower generate model <name> [attributes] [options]      generate a model
\ \ 
\ \ Options:
\ \   -h, --help                        output usage information
\ \   -v, --version                     output version number
\ \ 
\ \ Examples:
\ \   tower generate scaffold Post title:string body:text belongsTo:user
\ \   tower generate model Post title:string body:text belongsTo:user
\ \ 
'''
    program.parse(argv)

    program.help ||= program.rawArgs.length == 3

    if program.help
      console.log program.options[program.options.length - 1].description
      process.exit()

  run: ->
    Tower.Generator.run(@program.args[1], program: @program, modelName: @program.args[2])

module.exports = Tower.Command.Generate
