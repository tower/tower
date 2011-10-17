# https://github.com/quirkey/node-logger/blob/master/logger.js
class Logger
  @FATAL: 0
  @ERROR: 1
  @WARN:  2
  @INFO:  3
  @DEBUG: 4
  
  level: @DEBUG
  
  log: ->
    
    
  format: (level, date, message) -> "#{level} [#{date}] #{message}"
    
  for log_level in ["fatal", "error", "warn", "info", "debug"]
    @::[log_level] = ->
      args = Array.prototype.slice.call(arguments)
      args.unshift(log_level)
      @log.apply(@, args)
  
module.exports = Logger
