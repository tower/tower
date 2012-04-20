# @todo
# @mixin
Tower.Generator.Shell =
  sayStatus: (status, color) ->
    _console.log status if @options.verbose
    #base.shell.sayStatus status, relativeDestination, color if options.verbose

  promptMultiline: (key, args...) ->
    @program.prompt("#{key}:", args...)

  prompt: (key, args...) ->
    @program.prompt("#{key}: ", args...)

  choose: (description, list, callback) ->
    console.log description
    @program.choose list, callback

module.exports = Tower.Generator.Shell
