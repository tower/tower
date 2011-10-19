Support =
  Class:          require('./support/class')
  Logger:         require('./support/logger')
  File:           require('./support/file')
  String:         require('./support/string')
  Dependencies:   require('./support/dependencies')
  System:         require('./support/system')
  Lookup:         require('./support/lookup')
  
  # Applies the helpers to native objects, so
  # Metro.Support.String.constantize("User") becomes
  # "User".constantize
  to_ruby: ->
    String.prototype[key] = value for key, value of Metro.Support.String
    
module.exports = Support
