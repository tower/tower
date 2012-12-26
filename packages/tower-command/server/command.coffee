_ = Tower._

require('commander').Command.prototype.helpIfNecessary = (length) ->
  if (length && @rawArgs.length == length) || @rawArgs.indexOf('--help') > -1 || @rawArgs.indexOf('-h') > -1
    @outputHelp()
    process.exit()

# @todo This should `require` the minimal amount of code possible, 
#   to execute as fast as possible.
# 
# @module
Tower.Command =
  load: (name) ->
    require "./#{name}"

  # Short names to invoke commands.
  aliases:
    c: 'console'
    g: 'generate'
    d: 'destroy'
    s: 'server'
    
  # Figure out the command you want to run, then run it.
  #
  # @param [Array] argv Command line arguments (['node', 'tower', 'new', 'blog'])
  #
  # @return [void]
  run: (argv) ->
    command = argv[2]
    command = 'info' if !command || !!command.match(/^-/)
    if command == 'select'
      command = 'database'
      argv.splice(2, 1, 'database', 'list')
    command = @aliases[command] if @aliases.hasOwnProperty(command)
    #throw new Error('You must give tower a command (e.g. 'tower new my-app' or 'tower server')') unless command
    # @todo in the process of making the commands just functions instead of classes,
    #   and so they don't require the Tower namespace directly, to speed up execution.
    switch command
      when 'install' then 'x' # @todo install ./bin/dependencies
      when 'exec'
        @exec(argv[3])
      else
        fn = Tower.Command.load(command)
        if command == 'info'
          fn(argv)
        else
          command = new Tower['Command' + _.camelize(command)](argv)
          command.run()

module.exports = Tower.Command
