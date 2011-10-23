Support =
  Class:          require('./support/class')
  Path:           require('./support/path')
  String:         require('./support/string')
  Hash:           require('./support/hash')
  Object:         require('./support/object')
  Array:          require('./support/array')
  Date:           require('./support/date')
  Dependencies:   require('./support/dependencies')
  System:         require('./support/system')
  Lookup:         require('./support/lookup')
  
  # Applies the helpers to native objects, so
  # Metro.Support.String.constantize("User") becomes
  # "User".constantize
  to_ruby: ->
    String.prototype[key] = value for key, value of Metro.Support.String
    
  to_underscore: ->
    require('underscore').extend {}, Metro.Support.String, Metro.Support.Hash, Metro.Support.Array
    
module.exports = Support
