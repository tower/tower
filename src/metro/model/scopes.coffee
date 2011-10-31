class Metro.Model.Scopes
  #constructor: -> super
  
  # Create named scope class method finders for a model.
  #
  # @example Add scope to a User model
  # 
  #     class User
  #       @scope "active",      @where(active: true)
  #       @scope "recent",      @where(createdAt: ">=": 2.days().ago()).order("createdAt", "desc").order("email", "asc")
  #       @scope "developers",  @where(tags: _anyIn: ["ruby", "javascript"])
  # 
  @scope: (name, scope) ->
    @[name] = if scope instanceof Metro.Model.Scope then scope else @where(scope)
  
  @where: ->
    @scoped().where(arguments...)
    
  @order: ->
    @scoped().order(arguments...)
    
  @limit: ->
    @scoped().limit(arguments...)
  
  # The fields you want to pluck from the database  
  @select: ->
    @scoped().select(arguments...)
    
  @joins: ->
    @scoped().joins(arguments...)
    
  @includes: ->
    @scoped().includes(arguments...)
  
  # GEO!  
  @within: ->
    @scoped().within(arguments...)
  
  @scoped: ->
    new Metro.Model.Scope(@name)
    
  @all: (callback) ->
    @store().all(callback)
  
  @first: (callback) ->
    @store().first(callback)
  
  @last: (callback) ->
    @store().last(callback)
  
  @find: (id, callback) ->
    @store().find(id, callback)
    
  @count: (callback) ->
    @store().count(callback)
    
  @exists: (callback) ->
    @store().exists(callback)
  
module.exports = Metro.Model.Scopes
