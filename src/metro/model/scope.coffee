###
Passing options hash containing :conditions, :include, :joins, :limit, :offset, :order, :select, :readonly, :group, :having, :from, :lock to any of the ActiveRecord provided class methods, is now deprecated.

New AR 3.0 API:

    new(attributes)
    create(attributes)
    create!(attributes)
    find(id_or_array)
    destroy(id_or_array)
    destroy_all
    delete(id_or_array)
    delete_all
    update(ids, updates)
    update_all(updates)
    exists?
    
    first
    all
    last
    find(1)
    
success:  
  string:
    User.where(title: $in: ["Hello", "World"]).all()
    User.where(title: $eq: "Hello").all()
    User.where(title: "Hello").all()
    User.where(title: "=~": "Hello").all()
    User.where(title: "=~": /Hello/).all()
    
    # create from scope only if exact matches
    User.where(title: "Hello").create()
  
  id:  
    User.find(1)
    User.find(1, 2, 3)
    User.where(id: $in: [1, 2, 3]).all()
    User.where(id: $nin: [1, 2, 3]).all()
    User.where($or: [{id: 1}, {username: "john"}]).all()
    User.anyIn(id: [1, 2, 3]).all()
    User.excludes(firstName: "Hello", lastName: "World").all()
    
  order:
    User.asc("id").desc("username").all()
    User.order(["asc", "id"], ["desc", "username"]).all()
    User.where(username: "=~": /^a/).asc("username").desc("createdAt").all()
    
  date:
    User.where(createdAt: ">=": 10000000).where(createdAt: "<=": 40000000).all()
    
  nested:
    User.where(posts: createdAt: ">=": x).all()
    
fail:
  string:  
    User.where(title: $in: ["Hello", "World"]).create()

###
class Metro.Model.Scope extends Metro.Object
  constructor: (sourceClassName) ->
    @sourceClassName  = sourceClassName
    @conditions       = []
  
  where: ->
    @conditions.push ["where", arguments]
    @
    
  order: ->
    @conditions.push ["order", arguments]
    @
    
  limit: ->
    @conditions.push ["limit", arguments]
    @
    
  select: ->
    @conditions.push ["select", arguments]
    @
    
  joins: ->
    @conditions.push ["joins", arguments]
    @
    
  includes: ->
    @conditions.push ["includes", arguments]
    @
    
  paginate: ->
    @conditions.push ["paginate", arguments]
    @
    
  within: ->
    @conditions.push ["within", arguments]
    @
    
  # find(1)  
  # find(1, 2, 3)
  find: (ids..., callback) ->
    {query, options} = @_translateConditions()
    @store().find ids..., query, options, callback
    
  all: (callback) ->
    {query, options} = @_translateConditions()
    @store().all query, options, callback
    
  first: (callback) ->
    {query, options} = @_translateConditions()
    @store().first(callback)
    
  last: (callback) ->
    {query, options} = @_translateConditions()
    @store().last(callback)
  
  build: (attributes, callback) ->
    {query, options} = @_translateConditions()
    attributes = Metro.Support.Object.extend query, attributes
    @store().build options, attributes, callback
    
  create: (attributes, callback) ->
    {query, options} = @_translateConditions()
    attributes = Metro.Support.Object.extend query, attributes
    @store().create options, attributes, callback
    #@store().create Metro.Support.Object.extend(@_translateConditions(@conditions), attributes), callback
  
  update: (ids..., updates, callback) ->
    {query, options} = @_translateConditions()
    @store().update ids..., query, options, callback
    
  updateAll: (updates, callback) ->
    {query, options} = @_translateConditions()
    @store().updateAll updates, query, options, callback
  
  delete: (ids..., callback)->
    {query, options} = @_translateConditions()
    @store().delete ids..., query, options, callback

  deleteAll: (callback) ->
    {query, options} = @_translateConditions()
    @store().deleteAll query, options, callback
    
  destroy: (ids..., callback) ->
    {query, options} = @_translateConditions()
    @store().destroy ids..., query, options, callback
    
  destroyAll: (callback) ->
    {query, options} = @_translateConditions()
    @store().destroyAll query, options, callback
    
  _createQuery: ->
    conditions  = @conditions
    query       = {}
    store       = @store()
    
    for condition in conditions
      switch condition[0]
        when "where"
          item = condition[1][0]
          for key, value of item
            query[key] = value
        when "order"
          options.sort = condition[1][0]
    
    query: query, options: options
  
  # @_translateUpdateAttributes tags: [1, 2]
  _translateUpdateAttributes: (attributes) ->
    
  store: ->
    @model().store()
    
  model: ->
    Metro.constant(@sourceClassName)

module.exports = Metro.Model.Scope
