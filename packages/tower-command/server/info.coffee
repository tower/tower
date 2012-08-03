class Tower.Command.Info
  constructor: (argv) ->
    @program = program = require('commander')
    program
      .version(Tower.version)
      .option('-v, --version')
      .option '-h, --help', '''
\ \ Usage:
\ \   tower [command] [options]
\ \ 
\ \ Commands:
\ \   new <app-name>                    generate a new Tower application in folder "app-name"
\ \   console                           command line prompt to your application
\ \   generate <generator>              generate project files (models, views, controllers, scaffolds, etc.)
\ \ 
\ \ Options:
\ \   -h, --help                        output usage information
\ \   -v, --version                     output version number
\ \ 
'''
    program.parse(argv)

    program.help ||= program.rawArgs.length == 2

    if program.help
      console.log program.options[program.options.length - 1].description
      process.exit()

  run: ->


module.exports = Tower.Command.Info
