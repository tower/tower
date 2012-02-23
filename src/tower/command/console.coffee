# http://nodejs.org/docs/v0.6.1/api/repl.html
class Tower.Command.Console
  constructor: (argv) ->
    @program = require('commander')
    
    @program
      .option('-e, --environment [value]', 'output parsed comments for debugging')
      .parse(argv)
  
  run: ->
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
