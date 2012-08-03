# @module
Tower.Command =
  # Short names to invoke commands.
  aliases:
    c: 'console'
    g: 'generate'
    s: 'server'

  # Figure out the command you want to run, then run it.
  #
  # @param [Array] argv Command line arguments (['node', 'tower', 'new', 'blog'])
  #
  # @return [void]
  run: (argv) ->
    command = argv[2]
    command = 'info' if !command || !!command.match(/^-/)
    command = @aliases[command] if @aliases.hasOwnProperty(command)
    #throw new Error('You must give tower a command (e.g. 'tower new my-app' or 'tower server')') unless command
    command = new Tower['Command' + Tower.SupportString.camelize(command)](argv)
    command.run()

module.exports = Tower.Command
