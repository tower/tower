class Metro.Store.FileSystem  
  find: (query, callback) ->
    
  @alias "select", "find"
  
  first: (query, callback) ->
  
  last: (query, callback) ->
  
  all: (query, callback) ->
  
  length: (query, callback) ->
    
  @alias "count", "length"
    
  remove: (query, callback) ->
    
  clear: ->
    
  toArray: ->
    
  create: (record, callback) ->
    @collection().insert(record, callback)
    
  update: (record) ->
    
  destroy: (record) ->
    
  sort: ->
  
module.exports = Metro.Store.FileSystem
