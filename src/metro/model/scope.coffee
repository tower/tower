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
  @scopes:    ["where", "order", "asc", "desc", "limit", "offset", "select", "joins", "includes", "excludes", "paginate", "within"]
  @finders:   ["find", "all", "first", "last"]
  @builders:  ["build", "create", "update", "updateAll", "delete", "deleteAll", "destroy", "destroyAll"]
  
  constructor: (options = {}) ->
    @model    = options.model
    @criteria = options.criteria || new Metro.Model.Criteria
  
  for key in @scopes
    @::[key] = ->
      @criteria[key](arguments...)
      @
    
  # find(1)  
  # find(1, 2, 3)
  find: (ids..., callback) ->
    @store().find ids..., @criteria.query, @criteria.options, callback
    
  all: (callback) ->
    @store().all @criteria.query, @criteria.options, callback
    
  first: (callback) ->
    @store().first @criteria.query, @criteria.options, callback
    
  last: (callback) ->
    @store().last @criteria.query, @criteria.options, callback
  
  build: (attributes, callback) ->
    @store().build Metro.Support.Object.extend(@criteria.query, attributes), @criteria.options, callback
    
  create: (attributes, callback) ->
    @store().create Metro.Support.Object.extend(@criteria.query, attributes), @criteria.options, callback
  
  update: (ids..., updates, callback) ->
    @store().update ids..., @criteria.query, @criteria.options, callback
    
  updateAll: (updates, callback) ->
    @store().updateAll updates, @criteria.query, @criteria.options, callback
  
  delete: (ids..., callback)->
    @store().delete ids..., @criteria.query, @criteria.options, callback

  deleteAll: (callback) ->
    @store().deleteAll @criteria.query, @criteria.options, callback
    
  destroy: (ids..., callback) ->
    @store().destroy ids..., @criteria.query, @criteria.options, callback
    
  destroyAll: (callback) ->
    @store().destroyAll @criteria.query, @criteria.options, callback
    
  store: ->
    @model.store()
    
  # you want to clone it so you can reuse it multiple times:
  # 
  #     users = User.where(username: /santa/)
  #     newUsers = users.where(createdAt: ">=": _(2).days().ago())
  #     users.all()
  #     newUsers.all()
  clone: ->
    new @(model: @model, criteria: @criteria.clone())

module.exports = Metro.Model.Scope
