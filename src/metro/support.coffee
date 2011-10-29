Support =
  Array:          require './support/array'
  Class:          require './support/class'
  Callbacks:      require './support/callbacks'
  Concern:        require './support/concern'
  Date:           require './support/date'
  Dependencies:   require './support/dependencies'
  Hash:           require './support/hash'
  IE:             require './support/ie'
  I18n:           require './support/i18n'
  Inflector:      require './support/inflector'
  Lookup:         require './support/lookup'
  Object:         require './support/object'
  Path:           require './support/path'
  String:         require './support/string'
  System:         require './support/system'
  RegExp:         require './support/regexp'
  Time:           require './support/time'

  agent: if typeof(window) != 'undefined' then navigator.userAgent else 'node'
  
  isInt: (n) -> 
    # typeof(n) == 'number' && n % 1 == 0
    n == +n && n == (n|0)
  
  isFloat: (n) ->
    # typeof(n) == 'number' && n % 1 != 0
    n == +n && n != (n|0)
    
  isPresent: (object) ->
    for key, value of object
      return true
    return false
  
  isBlank: (object) ->
    for key, value of object
      return false
    return true
  
module.exports = Support
