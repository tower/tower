Tower.Model.Attributes =
  ClassMethods:
    field: (name, options) ->
      @fields()[name] = new Tower.Model.Attribute(@, name, options)
    
    fields: ->
      @_fields   ||= {}
      
  get: (name) ->
    unless @has(name)
      field = @constructor.fields()[name]
      @attributes[name] = field.defaultValue(@) if field
      
    @attributes[name]
  
  # post.set $pushAll: tags: ["ruby"]
  # post.set $pushAll: tags: ["javascript"]
  # post.attributes["tags"] #=> ["ruby", "javascript"]
  # post.changes["tags"]    #=> [[], ["ruby", "javascript"]]
  # post.set $pop: tags: "ruby"
  # post.attributes["tags"] #=> ["javascript"]
  # post.changes["tags"]    #=> [[], ["javascript"]]
  # if the changes looked like this:
  #   post.changes["tags"]    #=> [["ruby", "javascript"], ["javascript", "node.js"]]
  # then the updates would be
  #   post.toUpdates()        #=> {$popAll: {tags: ["ruby"]}, $pushAll: {tags: ["node.js"]}}
  #   popAll  = _.difference(post.changes["tags"][0], post.changes["tags"][1])
  #   pushAll = _.difference(post.changes["tags"][1], post.changes["tags"][0])
  set: (key, value) ->
    if typeof key == "object"
      updates = key
    else
      updates = {}
      updates[key] = value
    
    @_set(key, value) for key, value of updates
  
  assignAttributes: (attributes) ->
    for key, value of attributes
      delete @changes[key]
      @attributes[key] = value
    @
    
  has: (key) ->
    @attributes.hasOwnProperty(key)
  
  # @private
  _set: (key, value) ->
    @_attributeChange(key, value)
    @attributes[key] = value

    
module.exports = Tower.Model.Attributes
