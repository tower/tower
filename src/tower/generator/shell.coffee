Tower.Generator.Shell =    
  sayStatus: (status, color) ->
    _console.log status if @options.verbose
    #base.shell.sayStatus status, relativeDestination, color if options.verbose
    
module.exports = Tower.Generator.Shell
