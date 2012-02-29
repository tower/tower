# http://nodejs.org/docs/v0.6.1/api/repl.html
class Tower.Command.Console
  constructor: (argv) ->
    @program = program = require('commander')
    
    program
      .version(Tower.version)
      .option('-e, --environment [value]')
      .option '-h, --help', '''
\ \ Usage: 
\ \   tower console [options]
\ \ 
\ \ Options:
\ \   -e, --environment [value]         sets Tower.env (development, production, test, etc., default: development)
\ \   -h, --help                        output usage information
\ \   -v, --version                     output version number
\ \   
'''
    program.parse(argv)
    
    program.environment ||= "development"
    
    if program.help
      console.log program.options[program.options.length - 1].description
      process.exit()
  
  run: ->
    Tower.env = @program.environment
    
    client = require("repl").start("tower> ").context
    
    client.reload = ->
      app = Tower.Application.instance()
      app.initialize()
      app.stack()
      client.Tower  = Tower
      client._      = _
      client[Tower.namespace()] = app
    
    client._c = ->
      l       = arguments.length
      message = "Callback called with " + l + " argument" + (if l is 1 then "" else "s") + (if l > 0 then ":\n" else "")
      i       = 0
      
      while i < 10
        if i < arguments.length
          client["_" + i] = arguments[i]
          message += "_" + i + " = " + arguments[i] + "\n"
        else
          delete client["_" + i]  if client.hasOwnProperty("_" + i)
        i++
      console.log message

    client.exit = ->
      process.exit 0

    process.nextTick client.reload
  
module.exports = Tower.Command.Console
