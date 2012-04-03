Tower.Model.IdentityMap =
  repository: {}
  
  get: (klass, key) ->
    @collection(klass)[key]
    
  add: (record) ->
    @collection(record)[record.get("id")] = record
  
  remove: (record) ->
    delete @collection(record)[record.get("id")]
    
  collection: (object) ->
    object = object.constructor unless typeof object == "function"
    @repository[object.name] ||= {}
    
module.exports = Tower.Model.IdentityMap
