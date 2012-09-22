class Tower.CommandDatabase
  constructor: (argv) ->
    @program = program = require('commander')

    array = (value) ->
      value.split(/,\s*/)

    program
      .version(Tower.version)
      .option('-f, --fields <names>', 'Selected fields', array, [])
      .option('-v, --version')
      .option '-h, --help', '''
\ \ Usage:
\ \   tower database [query]
\ \ 
\ \ Options:
\ \   -h, --help                        output usage information
\ \   -v, --version                     output version number
\ \ 
\ \ Examples:
\ \   tower database list users
\ \ 
'''
    program.parse(argv)

    program.help ||= program.rawArgs.length == 2

    if program.help
      console.log program.options[program.options.length - 1].description
      process.exit()

    # @todo this should have a full SQL query parser
    program.modelClassName = _.camelize _.singularize argv[argv.length - 1]
    program.action = argv[argv.length - 2]

  # @todo pagination, editing with ascii escape sequences, etc.
  run: ->
    Table = require('cli-table')

    app = Tower.Application.instance()
    app.isConsole = true
    app.initialize =>
      app.stack()

      Model   = Tower.constant(@program.modelClassName)
      fields  = _.keys Model.fields()
      fields  = _.intersection @program.fields, fields if @program.fields.length

      columns = _.map fields, (i) ->
        i.length

      fetch = (done) =>
        switch @program.action
          when 'index', 'list'
            Model.limit(100).all(done)

      fetch (error, records) =>
        table = new Table(head: fields)
        colWidths: columns

        records.forEach (record) ->

          properties = _.map record.getEach(fields), (i) -> String(i)
          table.push properties

        console.log table.toString()
        process.nextTick process.exit

module.exports = Tower.CommandDatabase
