class Tower.CommandServer
  constructor: (argv) ->
    @program = program = require('commander')

    program
      .version(Tower.version)
      .option('-e, --environment [value]', 'sets Tower.env (development, production, test, etc.)')
      .option('-p, --port <n>', 'port for the application')
      .option('--static', 'disable-watch')
      .option('--single', 'Single page app')
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
      
      # @todo move these onto {Tower.config}
      Tower.isSinglePage = !!program.single

      if program.help
        console.log program.options[program.options.length - 1].description
        process.exit()

  run: ->
    program     = @program
    Tower.env   = program.environment || process.env.NODE_ENV || "development"
    process.env.NODE_ENV = Tower.env
    
    if !!program.static # if true
      Tower.watch = false
    else if Tower.env != 'development'
      Tower.watch = false
    else
      Tower.watch = true

    Tower.lazyLoadApp  = Tower.env == 'development'

    Tower.port  = program.port = if program.port then parseInt(program.port) else (process.env.PORT || 3000) # 1597
    
    Tower.Application.instance().run()

module.exports = Tower.CommandServer
