# https://github.com/quirkey/node-logger/blob/master/logger.js
# https://github.com/indexzero/winston
# https://github.com/TooTallNate/node-elf-logger/blob/master/lib/elf-logger.js
# https://github.com/visionmedia/log.js/blob/master/lib/log.js
# https://github.com/cowboy/javascript-debug
class Logger
  @FATAL: 0
  @ERROR: 1
  @WARN:  2
  @INFO:  3
  @DEBUG: 4
  
  level: @DEBUG
  
  log: ->
    
    
  format: (level, date, message) -> "#{level} [#{date}] #{message}"
    
  error: ->
    console.error(arguments...)
  
  warn: ->
    console.warn(arguments...)
  
  for log_level in ["fatal", "error", "warn", "info", "debug"]
    @::[log_level] = ->
      args = Array.prototype.slice.call(arguments)
      args.unshift(log_level)
      @log.apply(@, args)
  
module.exports = Logger
