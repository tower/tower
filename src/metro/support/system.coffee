sys = require('sys')
exec = require('child_process').exec

class System
  @command: (command, callback) ->
    self = @
    exec command, (error, stdout, stderr) ->
      self.puts(error, stdout, stderr)
      callback.apply(@, error, stdout, stderr) if callback
    
  @puts: (error, stdout, stderr) ->
    sys.puts(stdout)
    
module.exports = System
