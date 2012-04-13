class Tower.Command.Server
  constructor: (argv) ->
    @program = program = require('commander')

    program
      .version(Tower.version)
      .option('-e, --environment [value]', 'sets Tower.env (development, production, test, etc.)')
      .option('-p, --port <n>', 'port for the application')
      .option('--static', 'disable-watch')
      .option('-v, --version')
      .option '-h, --help', '''
\ \ Usage:
\ \   tower server [options]
\ \ 
\ \ Options:
\ \   -e, --environment [value]         sets Tower.env (development, production, test, etc., default: development)
\ \   -p, --port                        port for the application, default: 3000
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
    program     = @program
    Tower.watch = !!!program.static
    Tower.env   = program.environment || "development"
    Tower.port  = program.port      = if program.port then parseInt(program.port) else (process.env.PORT || 3000) # 1597

    Tower.Application.instance().run()

module.exports = Tower.Command.Server
