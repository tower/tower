_path = require('path')
fs = require('fs')

class Tower.CommandConsole
  constructor: (argv) ->
    @program = program = require('commander')

    program
      .version(Tower.version)
      .usage('console [options]')
      .option('-e, --environment [value]', 'sets Tower.env (development, production, test, etc., default: development)')
      .option('-j, --javascript', 'run in javascript mode (coffee-script mode is default)')
      .option('-s, --synchronous', 'allows for database operations to run synchronously, via node fibers')
      # @todo so you can login to your heroku console or whatever without having to do it separately:
      #   tower console -s -r heroku
      .option('-r, --remote')

    program.parse(argv)
    program.helpIfNecessary()

    program.environment ||= 'development'
      
    Tower.env = @program.environment

  run: ->
    Tower.ModelCursor.include Tower.ModelCursorSync if @program.synchronous
    app = Tower.Application.instance()
    app.isConsole = true
    app.initialize()
    app.stack()
    app.watch() if Tower.watch
    app.initializeConsoleHooks()

    return @runCoffee() unless @program.javascript
    repl    = require("repl")
    repl    = repl.start
      prompt:"tower> "
      context: @
      eval:(cmd, context, filename, callback) -> 
        Fiber(->
          try
            callback(null, eval.call(context, cmd))
          catch error
            callback(error)
        ).run()

    client  = repl.context

    client.reload = =>
      client.Tower  = Tower
      client.Future = require('fibers/future')
      client.Fiber = Fiber
      #client._      = _
      client[Tower.namespace()] = app
      client._r = (name) ->
        (error, value) ->
          #args = _.args(arguments)
          #error = args.shift()
          if error
            console.log(error)
          else
            client[name] = value
            process.stdout.write(value)
          #console.log('tower> ')

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

  runCoffee: ->
    # Copied from coffee-script/lib/coffee-script/repl.coffee
    #
    # A very simple Read-Eval-Print-Loop. Compiles one line at a time to JavaScript
    # and evaluates it. Good for simple tests, or poking around the **Node.js** API.
    # Using it looks like this:
    #
    #     coffee> console.log "#{num} bottles of beer" for num in [99..1]

    # Require the **coffee-script** module to get access to the compiler.
    CoffeeScript = require 'coffee-script'
    readline     = require 'readline'
    {inspect}    = require 'util'
    {Script}     = require 'vm'
    Module       = require 'module'

    historyPath = _path.join(Tower.root, 'tmp', 'replHistory.coffee')
    # https://github.com/substack/node-humbug/blob/master/index.js
    #Stream = require('stream')
    #historyStream = new Stream
    #historyStream.readable = true
    #historyStream.writable = true
    #historyStream.write = (buf) ->
    #historyStream.end = ->
    #historyStream.destroy = historyStream.end
    #process.stdin.pipe(historyStream)

    # REPL Setup

    # Config
    REPL_PROMPT = 'tower> '
    REPL_PROMPT_CONTINUATION = '......> '
    enableColours = no
    unless process.platform is 'win32'
      enableColours = not process.env.NODE_DISABLE_COLORS

    # Start by opening up `stdin` and `stdout`.
    stdin = process.openStdin()
    stdout = process.stdout

    # It's pretty involved to read one line at a time up and down a file...
    # Saving for later, just reading in memory for now
    #historyReadStream   = fs.createReadStream(historyPath, flags: 'r', encoding: 'utf-8')
    historyWriteStream  = fs.createWriteStream(historyPath, flags: 'a', encoding: 'utf-8')
    history = if fs.existsSync(historyPath) then fs.readFileSync(historyPath, 'utf-8').split('\n').reverse() else []
    historyIndex = 0
    #
    #historyWriteStream.on 'drain', ->
    #
    #historyReadStream.pause()
    #historyReadStream.up = ->
    #  historyReadStream.resume()
    #historyReadStream.down = ->
    #  historyReadStream.resume()
    #
    #historyReadStream.on 'data', (data) ->
    #  console.log 'stream data!', data

    pressEnter = ->
      process.stdin.emit('keypress', '\u001b[6n', { name: 'enter', ctrl: false, meta: false, shift: false })

    # Log an error.
    error = (err) ->
      stdout.write (err.stack or err.toString()) + '\n'

    # The current backlog of multi-line code.
    backlog = ''

    # The main REPL function. **run** is called every time a line of code is entered.
    # Attempt to evaluate the command. If there's an exception, print it out instead
    # of exiting.
    run = (buffer) ->
      require('fibers/future')
      if !buffer.toString().trim() and !backlog
        repl.prompt()
        return
      code = backlog += buffer
      if code[code.length - 1] is '\\'
        backlog = "#{backlog[...-1]}\n"
        repl.setPrompt REPL_PROMPT_CONTINUATION
        repl.prompt()
        return
      repl.setPrompt REPL_PROMPT

      backlog = ''

      Fiber(->
        try
          $_ = global.$_
          _ = Tower._
          returnValue = CoffeeScript.eval "$_ = __ = (#{code}\n)", {
            filename: 'repl'
            modulename: 'repl'
          }
          if returnValue is undefined
            global.$_ = global.__ = $_
          process.stdout.write inspect(returnValue, no, 2, enableColours)
          pressEnter()
          # write history only if it's been successful
          code = code.trim()
          if repl.history[repl.history.length - 1] != code
            historyWriteStream.write(code + '\n')
        catch err
          error err
        repl.prompt()
      ).run()

    ## Autocompletion

    # Regexes to match complete-able bits of text.
    ACCESSOR  = /\s*([\w\.]+)(?:\.(\w*))$/
    SIMPLEVAR = /\s*(\w*)$/i

    # Returns a list of completions, and the completed text.
    autocomplete = (text) ->
      completeAttribute(text) or completeVariable(text) or [[], text]

    # Attempt to autocomplete a chained dotted attribute: `one.two.three`.
    completeAttribute = (text) ->
      if match = text.match ACCESSOR
        [all, obj, prefix] = match
        try
          val = Script.runInThisContext obj
        catch error
          return
        completions = getCompletions prefix, Object.getOwnPropertyNames val
        [completions, prefix]

    # Attempt to autocomplete an in-scope free variable: `one`.
    completeVariable = (text) ->
      free = (text.match SIMPLEVAR)?[1]
      if free?
        vars = Script.runInThisContext 'Object.getOwnPropertyNames(this)'
        keywords = (r for r in CoffeeScript.RESERVED when r[0..1] isnt '__')
        possibilities = vars.concat keywords
        completions = getCompletions free, possibilities
        [completions, free]

    # Return elements of candidates for which `prefix` is a prefix.
    getCompletions = (prefix, candidates) ->
      (el for el in candidates when el.indexOf(prefix) is 0)

    # Make sure that uncaught exceptions don't kill the REPL.
    process.on 'uncaughtException', error

    # Create the REPL by listening to **stdin**.
    if readline.createInterface.length < 3
      repl = readline.createInterface stdin, autocomplete
      stdin.on 'data', (buffer) -> repl.write buffer
    else
      repl = readline.createInterface stdin, stdout, autocomplete

    repl.historyIndex = historyIndex
    repl.history = history

    repl.on 'attemptClose', ->
      if backlog
        backlog = ''
        process.stdout.write '\n'
        repl.setPrompt REPL_PROMPT
        repl.prompt()
      else
        repl.close()

    repl.on 'close', ->
      process.stdout.write '\n'
      #historyReadStream.destroy()
      historyWriteStream.destroySoon()
      stdin.destroy()

    repl.on 'line', run

    repl.setPrompt REPL_PROMPT
    repl.prompt()


module.exports = Tower.CommandConsole
