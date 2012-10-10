class Tower.CommandServer
  constructor: (argv) ->
    @program = program = require('commander')

    program
      .version(Tower.version)
      .usage('server [options]')
      .option('-e, --environment [value]', 'sets Tower.env (development, production, test, etc.)')
      .option('-p, --port <n>', 'port for the application')
      .option('--static', 'disable-watch')
      .option('--single', 'Single page app')
      .option('-v, --version')
      .on '--help', ->
        console.log '''
\ \ Examples:
\ \   tower generate scaffold Post title:string body:text belongsTo:user
\ \   tower generate model Post title:string body:text belongsTo:user
'''
      program.parse(argv)

      program.helpIfNecessary()
      
      # @todo move these onto {Tower.config}
      Tower.isSinglePage = !!program.single

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

    # process.env.PORT == heroku, node community convention
    # process.env.port == azure
    # can't use parseInt b/c azure gives you crazy value.
    port = parseInt(program.port) || process.env.PORT || process.env.port || 3000

    Tower.port  = program.port = process.env.PORT = process.env.port = port

    # Tower.isDevelopment, etc.
    Tower["is#{_.camelize(Tower.env)}"] = true
    
    Tower.Application.instance().run()

module.exports = Tower.CommandServer
