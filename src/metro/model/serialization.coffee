Metro.Model.Serialization =
  ClassMethods:
    fromJSON: (data) ->
      records = JSON.parse(data)
      records = [records] unless records instanceof Array

      for record, i in records
        records[i] = new @(record)

      records

    fromForm: (data) ->
      
    fromXML: (data) ->
      
    toJSON: (records, options = {}) ->
      JSON.stringify(records)
  
  # https://github.com/oozcitak/xmlbuilder-js
  toXML: ->
  
  # @param only
  # @param include
  # @param except
  # @param methods
  # 
  #     @user.toJSON
  #       include:
  #         posts:
  #           include:
  #             taggings:
  #               include:
  #                 tag:
  #                   only: "name"
  toJSON: (options) ->
    @_serializableHash(options)
    #JSON.stringify(@attributes)
  
  toObject: ->
    @attributes
  
  clone: ->
    new @constructor(Metro.Support.Object.clone(@attributes))
    
  _serializableHash: (options = {}) ->  
    result = {}
    
    attributeNames = Metro.Support.Object.keys(@attributes)
    
    if only = options.only
      attributeNames = _.union(Metro.Support.Object.toArray(only), attributeNames)
    else if except = options.except
      attributeNames = _.difference(Metro.Support.Object.toArray(except), attributeNames)
    
    for name in attributeNames
      result[name] = @_readAttributeForSerialization(name)
      
    if methods = options.methods
      methodNames = Metro.Support.Object.toArray(methods)
      for name in methods
        result[name] = @[name]()
        
    # TODO: async!
    if includes = options.include
      includes  = Metro.Support.Object.toArray(includes)
      for include in includes
        unless Metro.Support.Object.isHash(include)
          tmp           = {}
          tmp[include]  = {}
          include       = tmp
          tmp           = undefined
          
        for name, opts of include
          records = @[name]().all()
          for record, i in records
            records[i] = record._serializableHash(opts)
          result[name] = records
        
    result
    
  _readAttributeForSerialization: (name, type = "json") ->
    @attributes[name]
  
module.exports = Metro.Model.Serialization
