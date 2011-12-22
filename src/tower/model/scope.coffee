class Tower.Model.Scope extends Tower.Class
  @scopes:    ["where", "order", "asc", "desc", "limit", "offset", "select", "joins", "includes", "excludes", "paginate", "within"]
  @finders:   ["find", "all", "first", "last", "count"]
  @builders:  ["build", "create", "update", "updateAll", "delete", "deleteAll", "destroy", "destroyAll"]
  
  constructor: (options = {}) ->
    @model    = options.model
    @criteria = options.criteria || new Tower.Model.Criteria
  
  for key in @scopes
    ((_key)->
      @::[_key] = ->
        @criteria[_key](arguments...)
        @
    ).call(@, key)
    
  # find(1)  
  # find(1, 2, 3)
  find: (ids..., callback) ->
    @store().find ids..., @criteria.query, @criteria.options, callback
    
  all: (callback) ->
    console.log @criteria.query
    @store().all @criteria.query, @criteria.options, callback
    
  first: (callback) ->
    @store().first @criteria.query, @criteria.options, callback
    
  last: (callback) ->
    @store().last @criteria.query, @criteria.options, callback
    
  count: (callback) ->
    @store().count @criteria.query, @criteria.options, callback
  
  build: (attributes, callback) ->
    @store().build Tower.Support.Object.extend(@criteria.query, attributes), @criteria.options, callback
    
  create: (attributes, callback) ->
    @store().create Tower.Support.Object.extend(@criteria.query, attributes), @criteria.options, callback
  
  update: (ids..., updates, callback) ->
    @store().update ids..., updates, @criteria.query, @criteria.options, callback
    
  updateAll: (updates, callback) ->
    @store().updateAll updates, @criteria.query, @criteria.options, callback
  
  delete: (ids..., callback)->
    @store().delete ids..., @criteria.query, @criteria.options, callback

  deleteAll: (callback) ->
    @store().deleteAll @criteria.query, @criteria.options, callback
    
  destroy: (ids..., callback) ->
    @store().delete ids..., @criteria.query, @criteria.options, callback
    
  destroyAll: (callback) ->
    @store().deleteAll @criteria.query, @criteria.options, callback
    
  store: ->
    @model.store()
    
  merge: (scope) ->
    @criteria.merge(scope.criteria)
    
  # you want to clone it so you can reuse it multiple times:
  # 
  #     users = User.where(username: /santa/)
  #     newUsers = users.where(createdAt: ">=": _(2).days().ago())
  #     users.all()
  #     newUsers.all()
  clone: ->
    new @(model: @model, criteria: @criteria.clone())

module.exports = Tower.Model.Scope
