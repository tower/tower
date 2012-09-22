# https://github.com/crcn/celeri
# http://blog.nodejitsu.com/six-nodejs-cli-apps
# http://stackoverflow.com/questions/10585683/how-do-you-edit-existing-text-and-move-the-cursor-around-in-the-terminal/10830168#10830168
# https://github.com/hij1nx/cdir/blob/master/cdir.js#L26
# https://developer.apple.com/library/mac/#documentation/opensource/Conceptual/ShellScripting/AdvancedTechniques/AdvancedTechniques.html
# http://tldp.org/HOWTO/Bash-Prompt-HOWTO/x361.html
# http://nodejs.org/api/tty.html
# https://github.com/TooTallNate/ansi.js
# http://en.wikipedia.org/wiki/ANSI_escape_code
# https://github.com/mscdex/node-ncurses
# https://github.com/jocafa/node-term-ui
# https://github.com/chjj/pty.js/
# https://github.com/SchizoDuckie/Node-CLI
# https://github.com/substack/node-cursory
# testing clis: https://github.com/LearnBoost/cli-table/blob/master/test/index.test.js
# https://github.com/visionmedia/node-term-css
# http://creativejs.com/2012/02/ansi-escapes-js/
# http://stackoverflow.com/questions/2575037/how-to-get-the-cursor-position-in-bash
# http://stackoverflow.com/questions/8343250/how-can-i-get-position-of-cursor-in-terminal
# http://stackoverflow.com/questions/8343250/how-can-i-get-position-of-cursor-in-terminal
# http://www.markcrocker.com/rexxtipsntricks/rxtt28.2.0773.html
# http://www.markcrocker.com/rexxtipsntricks/rxtt28.2.0392.html
# https://gist.github.com/3765464
# https://github.com/unconed/TermKit
# http://scie.nti.st/2006/12/19/vi-key-bindings-in-rails-console
# http://stackoverflow.com/questions/9122282/how-do-i-open-a-terminal-application-from-node-js
# http://www.brankovukelic.com/post/2091037293/turn-vim-into-powerful-javascript-editor
# http://railscasts.com/episodes/48-console-tricks-revised?view=comments
# 
# Technically you could build a DOM in the terminal using cheerio, to
# associate data with table rows
# 
# There it is! https://github.com/Marak/ANSIdom
# 
# - `\r` forces the cursor to the start of the line
# - `write("\033[?25h")` #=> shows the cursor
# - `write("\033[5m")` #=> blink on
# - `write("\033[25m")` #=> blink off
# 
# @example
#   tower select posts --select id,createdAt --where 'createdAt: $gte: _(1).days().ago()' --order createdAt- --limit 10 --page 2
class Tower.CommandDatabase
  constructor: (argv) ->
    @program = program = require('commander')

    array = (value) ->
      value.split(/,\s*/)

    coffeeValue = (value) ->
      # @todo use vm.runInCustomContext
      eval require('mint').coffee(value, {bare: true})

    order = (value) ->
      Tower.NetParam.create('sort', type: 'Order').parse(value)

    program
      .version(Tower.version)
      .option('-s, --select <fields>', 'Fields to return', array, [])
      .option('-w, --where <conditions>', 'Query conditions', coffeeValue, {})
      .option('-o, --order <conditions>', 'Array of orderings, e.g. "--order createdAt+,title-"', order, [])
      .option('-l, --limit <n>', 'Limit the records', parseInt, 20)
      .option('-p, --page <n>', 'Paginate', parseInt, 1)
      .option('-v, --version')
      .option '-h, --help', '''
\ \ Usage:
\ \   tower select [model] [query]
\ \   tower database select [model] [query]
\ \ 
\ \ Options:
\ \   -h, --help                        output usage information
\ \   -v, --version                     output version number
\ \ 
\ \ Examples:
\ \   tower select posts --select id,createdAt --where 'createdAt: $gte: _(1).days().ago()' --order createdAt- --limit 10 --page 2
\ \ 
'''
    program.parse(argv)

    program.help ||= program.rawArgs.length == 2

    if program.help
      console.log program.options[program.options.length - 1].description
      process.exit()

    # @todo this should have a full SQL query parser
    program.modelClassName = _.camelize _.singularize program.args[2]

  # @todo pagination, editing with ascii escape sequences, etc.
  run: ->
    # the order of this stuff is important: stdin = ttys; stdin.setRawMode, stdin.resume(), rs.emitKeypressEvents, etc.
    rl      = require('readline')
    ttys     = require('ttys')
    stdin   = ttys.stdin
    stdout  = ttys.stdout
    wasRaw  = stdin.isRaw
    stdin.setRawMode(true)
    buffer  = []

    process.on 'exit', -> stdin.setRawMode(wasRaw)

    cursor = require('ansi')(stdout)

    stdout.on 'newline', ->

    stdin.resume()

    up = ->
      cursor.up()

    down = ->
      cursor.down()
    
    right = ->
      cursor.forward()

    left = ->
      cursor.back()

    insertMode = ->
      cursor.isInsertMode = true

    escapeMode = ->
      cursor.isInsertMode = false

    backspace = ->
      stdout.write(cursor.characters.deleteLeft)

    deleteRecord = (row, column) ->
      cursor.up()
      console.log "DELETING RECORD: #{buffer[row]}", row, column, buffer.length

    _.extend cursor,
      characters:
        backspace:      '\b'
        tab:            '\t'
        verticalTab:    '\v'
        newline:        '\n'
        formFeed:       '\f'
        carriageReturn: '\r'
        up:             'A'
        down:           'B'
        right:          'C'
        left:           'D'
        # Clear line from current cursor position to end of line
        # http://wiki.bash-hackers.org/scripting/terminalcodes
        clearLine:        '\u001b[K'
        deleteRight:      '\u001b[1P' # 1 character
        deleteLeft:       '\u001b[1X' # 1 character
        insertCharacter:  '\u001b[1@'
        insertLine:       '\u001b[1L'
        deleteLine:       '\u001b[1M'
        # http://web.mit.edu/gnu/doc/html/screen_10.html
        # ESC [ Pn ; Pn r         (V)     Set Scrolling Region

      position: (callback) ->
        process.stdin.once 'data', (b) ->
          match = /\[(\d+)\;(\d+)R$/.exec(b.toString())
          [row, column] = match.slice(1, 3).map(Number) if match
          callback(null, row, column)

        # send the query position request code to stdout
        cursor.queryPosition()

    listener = (chunk, key) ->
      if key.ctrl && key.name == 'c'
        stdin.setRawMode(wasRaw)
        process.nextTick process.exit
        return

      switch key.name
        when 'up' then up()
        when 'down' then down()
        when 'right' then right()
        when 'left' then left()
        when 'i' then insertMode()
        when 'esc' then commandMode()
        when 'backspace' then backspace()
        when 'd'
          cursor.position (error, row, column) =>
            deleteRecord(row, column)

      #if key.name == 'up'
      #  stdin.emit('keypress', '\u001b[6n', { name: 'enter', ctrl: false, meta: false, shift: false })
        # this is how you can [hack] getting the current line
        # stdin.emit('keypress', '\r', { name: 'enter', ctrl: false, meta: false, shift: false })

    if rl.emitKeypressEvents
     rl.emitKeypressEvents(stdin)

    keypressListeners = stdin.listeners('keypress')

    # remove any current "keypress" listeners
    oldKeypressListeners = keypressListeners.splice(0)
    stdin.on 'keypress', listener
    x = rl.createInterface(stdin, stdout, null)
    
    # this is how you can [hack] getting the current line
    # stdin.emit('keypress', '\r', { name: 'enter', ctrl: false, meta: false, shift: false })
    x.on 'line', (cmd) ->
      console.log('You just typed: '+cmd)

    app = Tower.Application.instance()
    app.isConsole = true
    app.initialize =>
      app.stack()

      {select, where, order, limit, page, modelClassName} = @program

      Model   = Tower.constant(modelClassName)
      fields  = _.keys Model.fields()
      fields  = _.intersection select, fields if select.length

      # default column names
      columns = _.map fields, (i) -> i.length

      fetch = (done) =>
        # @todo refactor Tower.ControllerParams to handle this too
        return Model.where(where).order(order).limit(limit).page(page).all(done)

      fetch (error, records) =>
        #cursor.position (error, row, column) =>
        #  buffer = new Array(row - records.length - 1)
        #  ids = records.getEach('id')
        #  ids.forEach (id) ->
        #    buffer.push(id)
        #    console.log(id)

        Table   = require('cli-table')
        table = new Table(head: fields)
        colWidths: columns
        
        records.forEach (record) ->
          properties = _.map record.getEach(fields), (i) -> String(i)
          table.push properties
        
        table = table.toString()
        rows = table.split('\n')
        recordIndex = -1
        rows.forEach (row, i) ->
          console.log(row)
        
          if i > 2 && (i % 2 == 0) # gte 2 and even
            rows[i] = records[recordIndex++]

        process.nextTick process.exit

module.exports = Tower.CommandDatabase
