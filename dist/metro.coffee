class Flash
  constructor: -> super
  

class Redirecting
  redirectTo: ->
    

class Rendering
  constructor: -> super
  
  render: ->
    args = Array.prototype.slice.call(arguments, 0, arguments.length)
    
    if args.length >= 2 && typeof(args[args.length - 1]) == "function"
      callback = args.pop()
    
    view    = new Metro.View(@)
    @headers["Content-Type"] ?= @contentType
    
    self = @
    
    args.push finish = (error, body) ->
      self.body = body
      self.body ?= error.toString()
      callback(error, body) if callback
      self.callback()
    
    view.render.apply(view, args)
    
  renderToBody: (options) ->
    @_processOptions(options)
    @_renderTemplate(options)
    
  renderToString: ->
    options = @_normalizeRender(arguments...)
    @renderToBody(options)
    
  # private
  _renderTemplate: (options) ->
    @template.render(viewContext, options)


class Responding
  #constructor: -> super
  
  #@include Metro.Support.Concern
    
  @respondTo: ->
    @_respondTo ?= []
    @_respondTo = @_respondTo.concat(arguments)
    
  respondWith: ->
    data  = arguments[0]
    if arguments.length > 1 && typeof(arguments[arguments.length - 1]) == "function"
      callback = arguments[arguments.length - 1]
      
    switch(@format)
      when "json"
        @render json: data
      when "xml"
        @render xml: data
      else
        @render action: @action
  
  call: (request, response, next) ->
    @request  = request
    @response = response
    @params   = @request.params || {}
    @cookies  = @request.cookies || {}
    @query    = @request.query || {}
    @session  = @request.session || {}
    @format   = @params.format
    @headers  = {}
    @callback = next
    
    if @format && @format != "undefined"
      @contentType = Metro.Support.Path.contentType(@format)
    else 
      @contentType = "text/html"
    @process()
    
  process: ->  
    @processQuery()
    
    @[@params.action]()
    
  processQuery: ->
  
  constructor: ->
    @headers      = {}
    @status       = 200
    @request      = null
    @response     = null
    @contentType = "text/html"
    @params       = {}
    @query        = {}
    

class Controller
  constructor: -> super
  
  @Flash:         require './controller/flash'
  @Redirecting:   require './controller/redirecting'
  @Rendering:     require './controller/rendering'
  @Responding:    require './controller/responding'
  
  @include @Flash
  @include @Redirecting
  @include @Rendering
  @include @Responding
  
  @initialize: ->
    Metro.Support.Dependencies.load("#{Metro.root}/app/controllers")
    
  @teardown: ->
    delete @_helpers
    delete @_layout
    delete @_theme
    
  @reload: ->
    @teardown()
    @initialize()
  
  @helper: (object) ->
    @_helpers ?= []
    @_helpers.push(object)
  
  @layout: (layout) ->
    @_layout = layout
  
  @theme: (theme) ->
    @_theme = theme
    
  layout: ->
    layout = @constructor._layout
    if typeof(layout) == "function" then layout.apply(@) else layout
  
  @getter "controllerName", @,   -> Metro.Support.String.camelize(@name)
  @getter "controllerName", @::, -> @constructor.controllerName
  
  clear: ->
    @request  = null
    @response = null
    @headers  = null
  

class Metro.Model.Association
  @include Metro.Model.Scope
  
  constructor: (owner, reflection) ->
    @owner      = owner
    @reflection = reflection
  
  targetClass: ->
    global[@reflection.targetClassName]
    
  scoped: ->
    (new Metro.Model.Scope(@reflection.targetClassName)).where(@conditions())
    
  conditions: ->
    result = {}
    result[@reflection.foreignKey] = @owner.id if @owner.id && @reflection.foreignKey
    result
    
  @delegates "where", "find", "all", "first", "last", "store", to: "scoped"
  

class Metro.Model.Associations
  @hasOne: (name, options = {}) ->
  
  # Adds hasMany reflection to model.
  # 
  # @example Post with many categories
  # 
  #     class User
  #       @include Metro.Model
  #       
  #       @hasMany "categories", className: "Category"
  @hasMany: (name, options = {}) ->
    options.foreignKey = "#{Metro.Support.String.underscore(@name)}Id"
    @reflections()[name] = reflection = new Metro.Model.Reflection("hasMany", @name, name, options)
    
    Object.defineProperty @prototype, name, 
      enumerable: true, 
      configurable: true, 
      get: -> @_getHasManyAssociation(name)
      set: (value) -> @_setHasManyAssociation(name, value)
      
    reflection
  
  @belongsTo: (name, options = {}) ->
    @reflections()[name] = reflection = new Metro.Model.Association("belongsTo", @name, name, options)
    
    Object.defineProperty @prototype, name, 
      enumerable: true, 
      configurable: true, 
      get: -> @_getBelongsToAssocation(name)
      set: (value) -> @_setBelongsToAssocation(name, value)
    
    @keys()["#{name}Id"] = new Metro.Model.Attribute("#{name}Id", options)
    
    Object.defineProperty @prototype, "#{name}Id", 
      enumerable: true, 
      configurable: true, 
      get: -> @_getBelongsToAssocationId("#{name}Id")
      set: (value) -> @_setBelongsToAssocationId("#{name}Id", value)
    
    reflection
  
  @reflections: ->
    @_reflections ?= {}
    
  _getHasManyAssociation: (name) ->
    @constructor.reflections()[name].association(@id)
    
  _setHasManyAssociation: (name, value) ->
    @constructor.reflections()[name].association(@id).destroyAll()
    
  _getBelongsToAssocationId: (name) ->
    @attributes[name]
    
  _setBelongsToAssocationId: (name, value) ->
    @attributes[name] = value
    
  _getBelongsToAssocation: (name) ->
    id = @_getBelongsToAssocationId(name)
    return null unless id
    global[@reflections()[name].targetClassName].where(id: @id).first()
    
  _setBelongsToAssocation: (name, value) ->
    id = @_getBelongsToAssocationId(name)
    return null unless id
    global[@reflections()[name].targetClassName].where(id: @id).first()
  

class Metro.Model.Attribute
  constructor: (name, options = {}) ->
    @name = name
    @type = options.type || "string"
    @_default = options.default
    
    @typecastMethod = switch @type
      when Array, "array" then @_typecastArray
      when Date, "date", "time" then @_typecastDate
      when Number, "number", "integer" then @_typecastInteger
      when "float" then @_typecastFloat
      else @_typecastString
    
  typecast: (value) ->
    @typecastMethod.call(@, value)
    
  _typecastArray: (value) ->
    value
    
  _typecastString: (value) ->
    value
    
  _typecastDate: (value) ->
    value
    
  _typecastInteger: (value) ->
    return null if value == null || value == undefined
    parseInt(value)
    
  _typecastFloat: (value) ->
    return null if value == null || value == undefined
    parseFloat(value)
    
  defaultValue: (record) ->
    _default = @_default
    
    switch typeof(_default)
      when 'function'
        _default.call(record)
      else
        _default
    

class Metro.Model.Attributes
  @key: (key, options = {}) ->
    @keys()[key] = new Metro.Model.Attribute(key, options)
    
    Object.defineProperty @prototype, key, 
      enumerable: true
      configurable: true
      get: -> @getAttribute(key)
      set: (value) -> @setAttribute(key, value)
      
    @
    
  @keys: ->
    @_keys ?= {}
    
  @attributeDefinition: (name) ->
    definition = @keys()[name]
    throw new Error("Attribute '#{name}' does not exist on '#{@name}'") unless definition
    definition
    
  typeCast: (name, value) ->
    @constructor.attributeDefinition(name).typecast(value)
  
  typeCastAttributes: (attributes) ->
    for key, value of attributes
      attributes[key] = @typeCast(key, value)
    attributes
  
  getAttribute: (name) ->
    @attributes[name] ?= @constructor.keys()[name].defaultValue(@)
    
  @alias "get", "getAttribute" unless @hasOwnProperty("get")
  
  setAttribute: (name, value) ->
    beforeValue = @_trackChangedAttribute(name, value)
    @attributes[name] = value
    #@emit("fieldChanged", beforeValue: beforeValue, value: value)
    
  @alias "set", "setAttribute" unless @hasOwnProperty("set")
  

class Metro.Model.Callbacks
  @CALLBACKS = [
    "afterInitialize", "afterFind", "afterTouch", "beforeValidation", "afterValidation",
    "beforeSave", "aroundSave", "afterSave", "beforeCreate", "aroundCreate",
    "afterCreate", "beforeUpdate", "aroundUpdate", "afterUpdate",
    "beforeDestroy", "aroundDestroy", "afterDestroy", "afterCommit", "afterRollback"
  ]
  
  @defineCallbacks: ->
    callbacks = Metro.Support.Array.extractArgsAndOptions(arguments)
    options   = callbacks.pop()
    options.terminator ?= "result == false"
    options.scope ?= ["kind", "name"]
    options.only ?= ["before", "around", "after"]
    types = options.only.map (type) -> Metro.Support.String.camelize("_#{type}")
    
    for callback in callbacks
      for type in types
        @["_define#{type}Callback"](callback)
    
  @_defineBeforeCallback: (name) ->
    @["before#{Metro.Support.String.camelize("_#{name}")}"] = ->
      @setCallback(name, "before", arguments...)
      
  @_defineAroundCallback: (name) ->
    @["around#{Metro.Support.String.camelize("_#{name}")}"] = ->
      @setCallback(name, "around", arguments...)
      
  @_defineAfterCallback: (name) ->
    @["after#{Metro.Support.String.camelize("_#{name}")}"] = ->
      @setCallback(name, "after", arguments...)
  
  createOrUpdate: ->
    @runCallbacks "save", -> @super

  create: ->
    @runCallbacks "create", -> @super

  update: ->
    @runCallbacks "update", -> @super
    
  destroy: ->
    @runCallbacks "destroy", -> @super
    

class Metro.Model.Dirty
  isDirty: ->
    changes = @changes()
    for change of changes
      return true
    return false
    
  changes: ->
    @_changes ?= {}
    
  _trackChangedAttribute: (attribute, value) ->
    array = @changes[attribute] ?= []
    beforeValue = array[0] ?= @attributes[attribute]
    array[1] = value
    array = null if array[0] == array[1]
    if array
      @changes[attribute] = array
    else
      delete @changes[attribute]

    beforeValue
    

class Metro.Model.Factory
  @store: ->
    @_store ?= new Metro.Store.Memory
  
  @define: (name, options, callback) ->
    if typeof options == "function"
      callback = options
      options  = {}
    options ?= {}
    
    @store()[name] = [options, callback]
    
  @build: (name, overrides) ->
    attributes = @store()[name][1]()
    
    for key, value of overrides
      attributes[key] = value
    
    new (global[name](attributes))
    
  @create: (name, overrides) ->
    record = @build(name, overrides)
    record.save()
    record

en:
  metro:
    model:
      errors:
        validation:
          presence: "{{attribute}} can't be blank"
          minimum: "{{attribute}} must be a minimum of {{value}}"
class Metro.Model.Persistence
  #constructor: -> super
  
  @create: (attrs) ->
    record = new @(attrs)
    @store().create(record)
    record
    
  @update: ->
  
  @deleteAll: ->
    @store().clear()
    
  isNew: ->
    !!!attributes.id
    
  save: (options) ->
    runCallbacks ->
    
  update: (options) ->
    
  reset: ->
    
  @alias "reload", "reset"
  
  updateAttribute: (name, value) ->
    
  updateAttributes: (attributes) ->
    
  increment: (attribute, amount = 1) ->
    
  decrement: (attribute, amount = 1) ->
    
  reload: ->
    
  delete: ->
    
  destroy: ->
  
  createOrUpdate: ->
  
  isDestroyed: ->
    
  isPersisted: ->
  
  

class Metro.Model.Reflection
  constructor: (type, sourceClassName, name, options = {}) ->
    @type             = type
    @sourceClassName  = sourceClassName
    @targetClassName  = options.className || Metro.Support.String.camelize(Metro.Support.String.singularize(name))
    @foreignKey       = options.foreignKey
  
  targetClass: ->
    global[@targetClassName]
    
  association: (owner) ->
    new Metro.Model.Association(owner, @)


class Metro.Model.Scope
  constructor: (sourceClassName) ->
    @sourceClassName = sourceClassName
    @conditions = []
  
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
    
  within: ->
    @conditions.push ["within", arguments]
    @
    
  all: (callback) ->
    @store().all(@query(), callback)
    
  first: (callback) ->
    @store().first(@query(), callback)
    
  last: (callback) ->
    @store().last(@query(), callback)
  
  sourceClass: ->
    global[@sourceClassName]
    
  store: ->
    global[@sourceClassName].store()
    
  query: ->
    conditions = @conditions
    result = {}
    
    for condition in conditions
      switch condition[0]
        when "where"
          item = condition[1][0]
          for key, value of item
            result[key] = value
        when "order"
          result._sort = condition[1][0]
    
    result


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
  

class Metro.Model.Serialization
  # https://github.com/oozcitak/xmlbuilder-js
  toXML: ->
    
  toJSON: ->
    JSON.stringify(@attributes)
    
  toObject: ->
    
  clone: ->
    
  @fromJSON: (data) ->
    records = JSON.parse(data)
    records = [records] unless records instanceof Array
    
    for record, i in records
      records[i] = new @(record)
    
    records
    

class Metro.Model.Validation
  constructor: (name, value) ->
    @name       = name
    @value      = value
    @attributes = Array.prototype.slice.call(arguments, 2, arguments.length)
    
    @validationMethod = switch name
      when "presence" then @validatePresence
      when "min" then @validateMinimum
      when "max" then @validateMaximum
      when "count", "length" then @validateLength
      when "format"
        @value = new RegExp(@value) if typeof(@value) == 'string'
        @validateFormat
  
  validate: (record) ->
    success = true
    for attribute in @attributes
      unless @validationMethod(record, attribute)
        success = false
    success
    
  validatePresence: (record, attribute) ->
    unless !!record[attribute]
      record.errors().push
        attribute: attribute
        message: Metro.Support.I18n.t("metro.model.errors.validation.presence", attribute: attribute)
      return false
    true
  
  validateMinimum: (record, attribute) ->
    value = record[attribute]
    unless typeof(value) == 'number' && value >= @value
      record.errors().push 
        attribute: attribute
        message: Metro.Support.I18n.t("metro.model.errors.validation.minimum", attribute: attribute, value: value)
      return false
    true
  
  validateMaximum: (record, attribute) ->
    value = record[attribute]
    unless typeof(value) == 'number' && value <= @value
      record.errors().push attribute: attribute, message: "#{attribute} must be a maximum of #{@value}"
      return false
    true
  
  validateLength: (record, attribute) ->
    value = record[attribute]
    unless typeof(value) == 'number' && value == @value
      record.errors().push attribute: attribute, message: "#{attribute} must be equal to #{@value}"
      return false
    true
  
  validateFormat: (record, attribute) ->
    value = record[attribute]
    unless !!@value.exec(value)
      record.errors().push attribute: attribute, message: "#{attribute} must be match the format #{@value.toString()}"
      return false
    true


class Metro.Model.Validations
  constructor: -> super
  
  @validates: ->
    attributes = Array.prototype.slice.call(arguments, 0, arguments.length)
    options    = attributes.pop()
    
    Metro.throw_error("missing_options", "#{@name}.validates") unless typeof(options) == "object"
    
    validators = @validators()
    
    for key, value of options
      validators.push new Metro.Model.Validation(key, value, attributes...)
    
  @validators: ->
    @_validators ?= []
    
  validate: ->
    self        = @
    validators  = @constructor.validators()
    success     = true
    @errors().length = 0
    
    for validator in validators
      unless validator.validate(self)
        success = false
        
    success
  
  errors: ->
    @_errors ?= []
  

class Metro.Model
  @initialize: ->
    Metro.Support.Dependencies.load("#{Metro.root}/app/models")
    
  @teardown: ->
    delete @_store
  
  # Add the global store to your model.
  # 
  #     @store: new Metro.Store.Memory
  @store: ->
    @_store ?= new Metro.Store.Memory
  
  constructor: (attrs = {}) ->
    attributes  = {}
    definitions = @constructor.keys()
    
    for key, value of attrs
      attributes[key] = value
      
    for name, definition of definitions
      attributes[name] ||= definition.defaultValue(@) unless attrs.hasOwnProperty(name)
    
    @attributes = @typeCastAttributes(attributes)
    @changes    = {}

require './model/scope'
require './model/association'
require './model/associations'
require './model/attribute'
require './model/attributes'
require './model/dirty'
require './model/observing'
require './model/persistence'
require './model/reflection'
require './model/scopes'
require './model/serialization'
require './model/validation'
require './model/validations'

Metro.Model.include Metro.Model.Persistence
Metro.Model.include Metro.Model.Scopes
Metro.Model.include Metro.Model.Serialization
Metro.Model.include Metro.Model.Associations
Metro.Model.include Metro.Model.Validations
Metro.Model.include Metro.Model.Dirty
Metro.Model.include Metro.Model.Attributes


class Metro.Observer.Binding
  

# http://docs.sproutcore20.com/symbols/SC.Observable.html
class Metro.Observer

require './observer/binding'


class Metro.Presenter
  

class Metro.Route.DSL
  match: ->
    @scope ?= {}
    Metro.Route.create(new Metro.Route(@_extractOptions(arguments...)))
    
  get: ->
    @matchMethod("get", arguments...)
    
  post: ->
    @matchMethod("post", arguments...)
    
  put: ->
    @matchMethod("put", arguments...)
    
  delete: ->
    @matchMethod("delete", arguments...)
    
  matchMethod: (method) ->
    options = arguments.pop()
    options.via = method
    arguments.push(options)
    @match(options)
    @
    
  scope: ->
    
  controller: (controller, options, block) ->
    options.controller = controller
    @scope(options, block)
  
  # Scopes routes to a specific namespace. For example:
  #
  #   namespace "admin", ->
  #     resources "posts"
  #
  # This generates the following routes:
  #
  #       adminPosts GET    /admin/posts(.:format)          admin/posts#index
  #       adminPosts POST   /admin/posts(.:format)          admin/posts#create
  #    newAdminPost GET    /admin/posts/new(.:format)      admin/posts#new
  #   editAdminPost GET    /admin/posts/:id/edit(.:format) admin/posts#edit
  #        adminPost GET    /admin/posts/:id(.:format)      admin/posts#show
  #        adminPost PUT    /admin/posts/:id(.:format)      admin/posts#update
  #        adminPost DELETE /admin/posts/:id(.:format)      admin/posts#destroy
  #
  # === Options
  #
  # The +:path+, +:as+, +:module+, +:shallowPath+ and +:shallowPrefix+
  # options all default to the name of the namespace.
  #
  # For options, see <tt>Base#match</tt>. For +:shallowPath+ option, see
  # <tt>Resources#resources</tt>.
  #
  # === Examples
  #
  #   # accessible through /sekret/posts rather than /admin/posts
  #   namespace "admin", path: "sekret", ->
  #     resources "posts"
  #
  #   # maps to <tt>Sekret::PostsController</tt> rather than <tt>Admin::PostsController</tt>
  #   namespace "admin", module: "sekret", ->
  #     resources "posts"
  #
  #   # generates +sekretPostsPath+ rather than +adminPostsPath+
  #   namespace "admin", as: "sekret", ->
  #     resources "posts"
  namespace: (path, options, block) ->
    options = _.extend(path: path, as: path, module: path, shallowPath: path, shallowPrefix: path, options)
    @scope(options, block)
    
  # === Parameter Restriction
  # Allows you to constrain the nested routes based on a set of rules.
  # For instance, in order to change the routes to allow for a dot character in the +id+ parameter:
  #
  #   constraints id: /\d+\.\d+, ->
  #     resources "posts"
  #
  # Now routes such as +/posts/1+ will no longer be valid, but +/posts/1.1+ will be.
  # The +id+ parameter must match the constraint passed in for this example.
  #
  # You may use this to also restrict other parameters:
  #
  #   resources "posts", ->
  #     constraints postId: /\d+\.\d+, ->
  #       resources "comments"
  #
  # === Restricting based on IP
  #
  # Routes can also be constrained to an IP or a certain range of IP addresses:
  #
  #   constraints ip: /192.168.\d+.\d+/, ->
  #     resources "posts"
  #
  # Any user connecting from the 192.168.* range will be able to see this resource,
  # where as any user connecting outside of this range will be told there is no such route.
  constraints: (options, block) ->
    @scope(constraints: options, block)
    
  # Allows you to set default parameters for a route, such as this:
  # 
  #   defaults id: 'home', ->
  #     match 'scopedPages/(:id)', to: 'pages#show'
  # 
  # Using this, the `:id` parameter here will default to 'home'.
  defaults: (options, block) ->
    @scope(defaults: options, block)
  
  # Sometimes, you have a resource that clients always look up without
  # referencing an ID. A common example, /profile always shows the
  # profile of the currently logged in user. In this case, you can use
  # a singular resource to map /profile (rather than /profile/:id) to
  # the show action:
  #
  #   resource "geocoder"
  #
  # creates six different routes in your application, all mapping to
  # the +GeoCoders+ controller (note that the controller is named after
  # the plural):
  #
  #   GET     /geocoder/new
  #   POST    /geocoder
  #   GET     /geocoder
  #   GET     /geocoder/edit
  #   PUT     /geocoder
  #   DELETE  /geocoder
  #
  # === Options
  # Takes same options as +resources+.
  resource: ->
  
  # In Rails, a resourceful route provides a mapping between HTTP verbs
  # and URLs and controller actions. By convention, each action also maps
  # to particular CRUD operations in a database. A single entry in the
  # routing file, such as
  #
  #   resources "photos"
  #
  # creates seven different routes in your application, all mapping to
  # the +Photos+ controller:
  #
  #   GET     /photos/new
  #   POST    /photos
  #   GET     /photos/:id
  #   GET     /photos/:id/edit
  #   PUT     /photos/:id
  #   DELETE  /photos/:id
  #
  # Resources can also be nested infinitely by using this block syntax:
  #
  #   resources "photos", ->
  #     resources "comments"
  #
  # This generates the following comments routes:
  #
  #   GET     /photos/:photoId/comments/new
  #   POST    /photos/:photoId/comments
  #   GET     /photos/:photoId/comments/:id
  #   GET     /photos/:photoId/comments/:id/edit
  #   PUT     /photos/:photoId/comments/:id
  #   DELETE  /photos/:photoId/comments/:id
  #
  # === Options
  # Takes same options as <tt>Base#match</tt> as well as:
  #
  # [:pathNames]
  #   Allows you to change the paths of the seven default actions.
  #   Paths not specified are not changed.
  #
  #     resources "posts", pathNames: {new: "brandNew"}
  #
  #   The above example will now change /posts/new to /posts/brandNew
  #
  # [:only]
  #   Only generate routes for the given actions.
  #
  #     resources "cows", only: "show"
  #     resources "cows", only: ["show", "index"]
  #
  # [:except]
  #   Generate all routes except for the given actions.
  #
  #     resources :cows, :except => :show
  #     resources :cows, :except => [:show, :index]
  #
  # [:shallow]
  #   Generates shallow routes for nested resource(s). When placed on a parent resource,
  #   generates shallow routes for all nested resources.
  #
  #     resources "posts", shallow: true, ->
  #       resources "comments"
  #
  #   Is the same as:
  #
  #     resources :posts do
  #       resources :comments, :except => [:show, :edit, :update, :destroy]
  #     end
  #     resources :comments, :only => [:show, :edit, :update, :destroy]
  #
  #   This allows URLs for resources that otherwise would be deeply nested such
  #   as a comment on a blog post like <tt>/posts/a-long-permalink/comments/1234</tt>
  #   to be shortened to just <tt>/comments/1234</tt>.
  #
  # [:shallowPath]
  #   Prefixes nested shallow routes with the specified path.
  #
  #     scope shallowPath: "sekret", ->
  #       resources "posts", ->
  #         resources "comments", shallow: true
  #
  #   The +comments+ resource here will have the following routes generated for it:
  #
  #     postComments    GET    /posts/:postId/comments(.:format)
  #     postComments    POST   /posts/:postId/comments(.:format)
  #     newPostComment GET    /posts/:postId/comments/new(.:format)
  #     editComment     GET    /sekret/comments/:id/edit(.:format)
  #     comment          GET    /sekret/comments/:id(.:format)
  #     comment          PUT    /sekret/comments/:id(.:format)
  #     comment          DELETE /sekret/comments/:id(.:format)
  #
  # === Examples
  #
  #   # routes call <tt>Admin::PostsController</tt>
  #   resources "posts", module: "admin"
  #
  #   # resource actions are at /admin/posts.
  #   resources "posts", path: "admin/posts"
  resources: ->
  
  # To add a route to the collection:
  #
  #   resources "photos", ->
  #     collection ->
  #       get 'search'
  #
  # This will enable Rails to recognize paths such as <tt>/photos/search</tt>
  # with GET, and route to the search action of +PhotosController+. It will also
  # create the <tt>searchPhotosUrl</tt> and <tt>searchPhotosPath</tt>
  # route helpers.
  collection: ->
  
  # To add a member route, add a member block into the resource block:
  #
  #   @resources "photos", ->
  #     @member ->
  #       @get 'preview'
  #
  # This will recognize <tt>/photos/1/preview</tt> with GET, and route to the
  # preview action of +PhotosController+. It will also create the
  # <tt>previewPhotoUrl</tt> and <tt>previewPhotoPath</tt> helpers.
  member: ->
    
  root: (options) ->
    @match '/', _.extend(as: "root", options)
    
  _extractOptions: ->
    path            = Metro.Route.normalizePath(arguments[0])
    options         = arguments[arguments.length - 1] || {}
    options.path    = path
    format          = @_extractFormat(options)
    options.path    = @_extractPath(options)
    method          = @_extractRequestMethod(options)
    constraints     = @_extractConstraints(options)
    defaults        = @_extractDefaults(options)
    controller      = @_extractController(options)
    anchor          = @_extractAnchor(options)
    name            = @_extractName(options)
    
    options         = _.extend options,
      method:         method
      constraints:    constraints
      defaults:       defaults
      name:           name
      format:         format
      controller:     controller
      anchor:         anchor
      ip:             options.ip
    
    options
    
  _extractFormat: (options) ->
    
  _extractName: (options) ->
    options.as
    
  _extractConstraints: (options) ->
    options.constraints || {}
    
  _extractDefaults: (options) ->
    options.defaults || {}
    
  _extractPath: (options) ->
    "#{options.path}.:format?"
    
  _extractRequestMethod: (options) ->
    options.via || options.requestMethod
  
  _extractAnchor: (options) ->
    options.anchor
    
  _extractController: (options) ->
    to = options.to.split('#')
    if to.length == 1
      action = to[0]
    else
      controller  = to[0]
      action      = to[1]
    
    controller   ?= (options.controller || @scope.controller)
    action       ?= (options.action || @scope.action)
    
    controller  = controller.toLowerCase().replace(/(?:Controller)?$/, "Controller")
    action      = action.toLowerCase()
    
    name: controller, action: action, className: _.camelize("_#{controller}")


class Metro.Route
  @include Metro.Model.Scopes
  
  @store: ->
    @_store ?= new Metro.Store.Memory
  
  @create: (route) ->
    @store().create(route)
  
  @normalizePath: (path) ->
    "/" + path.replace(/^\/|\/$/, "")
    
  @initialize: ->
    require "#{Metro.root}/config/routes"
  
  @teardown: ->
    @store().clear()
    delete require.cache[require.resolve("#{Metro.root}/config/routes")]
    delete @_store
    
  @reload: ->
    @teardown()
    @initialize()
  
  @draw: (callback) ->
    callback.apply(new Metro.Route.DSL(@))
    @
  
  constructor: (options) ->
    options    ?= options
    @path       = options.path
    @name       = options.name
    @method     = options.method
    @ip         = options.ip
    @defaults   = options.defaults || {}
    @constraints  = options.constraints
    @options    = options
    @controller = options.controller
    @keys       = []
    @pattern    = @extractPattern(@path)
    @id         = @path
    if @controller
      @id += @controller.name + @controller.action
    
  match: (path) ->
    @pattern.exec(path)
    
  extractPattern: (path, caseSensitive, strict) ->
    return path if path instanceof RegExp
    self = @
    return new RegExp('^' + path + '$') if path == "/"
    
    path = path.replace(/(\(?)(\/)?(\.)?([:\*])(\w+)(\))?(\?)?/g, (_, open, slash, format, symbol, key, close, optional) ->
      optional = (!!optional) || (open + close == "()")
      splat    = symbol == "*"
      
      self.keys.push
        name:     key
        optional: !!optional
        splat:    splat
      
      slash   ?= ""
      result = ""
      if !optional || !splat
        result += slash
      
      result += "(?:"
      # result += slash if optional
      if format?
        result += if splat then "\\.([^.]+?)" else "\\.([^/.]+?)"
      else
        result += if splat then "/?(.+)" else "([^/\\.]+)"
      result += ")"
      result += "?" if optional
      
      result
    )
    
    new RegExp('^' + path + '$', !!caseSensitive ? '' : 'i')

require './route/dsl'


Metro.Support.Array =
  extractArgs: (args) ->
    Array.prototype.slice.call(args, 0, args.length)
    
  extractArgsAndOptions: (args) ->
    args = Array.prototype.slice.call(args, 0, args.length)
    unless typeof(args[args.length - 1]) == 'object'
      args.push({})
    args
    
  argsOptionsAndCallback: ->
    args = Array.prototype.slice.call(arguments)
    last = args.length - 1
    if typeof args[last] == "function"
      callback = args[last]
      if args.length >= 3
        if typeof args[last - 1] == "object"
          options = args[last - 1]
          args = args[0..last - 2]
        else
          options = {}
          args = args[0..last - 1]
      else
        options = {}
    else if args.length >= 2 && typeof(args[last]) == "object"
      args      = args[0..last - 1]
      options   = args[last]
      callback  = null
    else
      options   = {}
      callback  = null
    
    [args, options, callback]
  
  # Sort objects by one or more attributes.
  # 
  #     cityPrimer = (string) ->
  #       string.toLowerCase()
  #     sortObjects deals, ["city", ["price", "desc"]], city: cityPrimer
  # 
  sortBy: (objects) ->
    sortings  = Array.prototype.slice.call(arguments, 1, arguments.length)
    callbacks = if sortings[sortings.length - 1] instanceof Array then {} else sortings.pop()
    
    valueComparator = (x, y) ->
      if x > y then 1 else (if x < y then -1 else 0)
      
    arrayComparator = (a, b) ->
      x = []
      y = []
      
      sortings.forEach (sorting) ->
        attribute = sorting[0]
        direction = sorting[1]
        aValue    = a[attribute]
        bValue    = b[attribute]
        
        unless typeof callbacks[attribute] is "undefined"
          aValue  = callbacks[attribute](aValue)
          bValue  = callbacks[attribute](bValue)
        
        x.push(direction * valueComparator(aValue, bValue))
        y.push(direction * valueComparator(bValue, aValue))

      if x < y then -1 else 1
    
    sortings = sortings.map (sorting) ->
      sorting = [sorting, "asc"] unless sorting instanceof Array
      
      if sorting[1] == "desc"
        sorting[1] = -1
      else
        sorting[1] = 1
      sorting
    
    objects.sort (a, b) ->
      arrayComparator a, b
  

class Metro.Support.Callbacks
  

moduleKeywords = ['included', 'extended', 'prototype']

class Metro.Support.Class
  # Rename an instance method
  #
  # ``` coffeescript
  # class User
  #   @alias "methods", "instance_methods"
  #
  # ```
  @alias: (to, from) ->
    @::[to] = @::[from]

  @alias_method: (to, from) ->
    @::[to] = @::[from]

  @accessor: (key, self, callback) ->
    @_accessors ?= []
    @_accessors.push(key)
    @getter(key, self, callback)
    @setter(key, self)
    @

  @getter: (key, self, callback) ->
    self    ?= @prototype

    unless self.hasOwnProperty("_getAttribute")
      Object.defineProperty self, "_getAttribute", enumerable: false, configurable: true, value: (key) -> @["_#{key}"]

    @_getters ?= []
    @_getters.push(key)
    Object.defineProperty self, "_#{key}", enumerable: false, configurable: true
    Object.defineProperty self, key, enumerable: true, configurable: true,
      get: ->
        @["_getAttribute"](key) || (@["_#{key}"] = callback.apply(@) if callback)

    @

  @setter: (key, self) ->
    self    ?= @prototype

    unless self.hasOwnProperty("_setAttribute")
      Object.defineProperty self, method, enumerable: false, configurable: true, value: (key, value) -> @["_#{key}"] = value

    @_setters ?= []
    @_setters.push(key)
    Object.defineProperty self, "_#{key}", enumerable: false, configurable: true
    Object.defineProperty self, key, enumerable: true, configurable: true, set: (value) -> @["_setAttribute"](key, value)

    @

  @classEval: (block) ->
    block.call(@)

  @delegate: (key, options = {}) ->
    to = options.to
    if typeof(@::[to]) == "function"
      @::[key] = ->
        @[to]()[key](arguments...)
    else
      Object.defineProperty @::, key, enumerable: true, configurable: true, get: -> @[to]()[key]

  @delegates: ->
    args    = Array.prototype.slice.call(arguments, 0, arguments.length)
    options = args.pop()

    for key in args
      @delegate(key, options)

  @include: (obj) ->
    throw new Error('include(obj) requires obj') unless obj

    @extend(obj)

    #for key, value of obj.prototype when key not in moduleKeywords
    #  @::[key] = value

    c = @
    child = @
    parent = obj

    #sn = if child.__super__ then child.__super__.constructor.name else "null"
    #console.log "#{@name}.__super__ (WAS) #{sn} and WILL BE #{parent.name}"

    clone = (fct)->
      clone_ = ->
        fct.apply this, arguments

      clone_:: = fct::
      for property of fct
        clone_[property] = fct[property] if fct.hasOwnProperty(property) and property isnt "prototype"
      clone_

    oldproto = child.__super__ if child.__super__
    cloned = clone(parent)
    newproto = cloned.prototype

    for key, value of cloned.prototype when key not in moduleKeywords
      @::[key] = value

    cloned.prototype = oldproto if oldproto
    child.__super__ = newproto

    included = obj.included
    included.apply(obj.prototype) if included
    @

  @extend: (obj) ->
    throw new Error('extend(obj) requires obj') unless obj
    for key, value of obj when key not in moduleKeywords
      @[key] = value

    extended = obj.extended
    extended.apply(obj) if extended
    @

  @new: ->
    new @(arguments...)

  @instanceMethods: ->
    result = []
    result.push(key) for key of @prototype
    result

  @classMethods: ->
    result = []
    result.push(key) for key of @
    result

  instanceExec: ->
    arguments[0].apply(@, arguments[1..-1]...)

  instanceEval: (block) ->
    block.apply(@)

  send: (method) ->
    if @[method]
      @[method].apply(arguments...)
    else
      @methodMissing(arguments...) if @methodMissing

  methodMissing: (method) ->

for key, value of Metro.Support.Class
  Function.prototype[key] = value
class Metro.Support.Concern  
  constructor: -> super
  
  @included: ->
    @_dependencies ?= []
    @extend   @ClassMethods if @hasOwnProperty("ClassMethods")
    @include  @InstanceMethods if @hasOwnProperty("InstanceMethods")
  
  # Module.appendFeatures in ruby
  @_appendFeatures: ->
  

fs = require('fs')
# https://github.com/fairfieldt/coffeescript-concat/blob/master/coffeescript-concat.coffee
# https://github.com/serpentem/coffee-toaster
# http://requirejs.org/
# _require = global.require
# global.require = (path) ->
#   Metro.Support.Dependencies.loadPath(path)

class Metro.Support.Dependencies
  @load: (directory) ->
    paths = require('findit').sync directory
    @loadPath(path) for path in paths
  
  @loadPath: (path) ->
    self  = @
    keys  = @keys
    klass = Metro.Support.Path.basename(path).split(".")[0]
    klass = Metro.Support.String.camelize("_#{klass}")
    unless keys[klass]
      keys[klass]   = new Metro.Support.Path(path)
      global[klass] = require(path)
      
  @clear: ->
    @clearDependency(key) for key, file of @keys
  
  @clearDependency: (key) ->
    file = @keys[key]
    delete require.cache[require.resolve(file.path)]
    global[key] = null
    delete global[key]
    @keys[key] = null
    delete @keys[key]
    
  @reloadModified: ->
    self = @
    keys = @keys
    for key, file of keys
      if file.stale()
        self.clearDependency(key)
        keys[key]   = file
        global[key] = require(file.path)
    
  @keys: {}
    

class Metro.Support.I18n
  @defaultLanguage: "en"
  
  @translate: (key, options = {}) ->
    if options.hasOwnProperty("tense")
      key += ".#{options.tense}"
    if options.hasOwnProperty("count")
      switch options.count
        when 0 then key += ".none"
        when 1 then key += ".one"
        else key += ".other"
    
    @interpolator().render(@lookup(key, options.language), locals: options)
    
  @t: @translate
    
  @lookup: (key, language = @defaultLanguage) ->
    parts   = key.split(".")
    result  = @store[language]
    
    try
      for part in parts
        result = result[part]
    catch error
      result = null
      
    throw new Error("Translation doesn't exist for '#{key}'") unless result?
    
    result
    
  @store: {}
    
  @interpolator: ->
    @_interpolator ?= new (require('shift').Mustache)
    

# Internet Explorer hacks
# https://gist.github.com/1307821
class IE
  

en =
  date:
    formats:
      # Use the strftime parameters for formats.
      # When no format has been given", it uses default.
      # You can provide other formats here if you like!
      default: "%Y-%m-%d"
      short: "%b %d"
      long: "%B %d, %Y"

    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    abbrDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    # Don't forget the nil at the beginning; there's no such thing as a 0th month
    monthNames: [null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    abbrMonthNames: [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    # Used in dateSelect and datetimeSelect.
    order: ["year", "month", "day"]

  time:
    formats:
      default: "%a, %d %b %Y %H:%M:%S %z"
      short: "%d %b %H:%M"
      long: "%B %d, %Y %H:%M"
    am: "am"
    pm: "pm"

# Used in array.toSentence.
  support:
    array:
      wordsConnector: ", "
      twoWordsConnector: " and "
      lastWordConnector: ", and "

# https://github.com/sstephenson/hike/blob/master/lib/hike/index.rb
class Metro.Support.Lookup
  
  # new Metro.Support.Lookup paths: ["./app/assets/stylesheets"], extensions: [".js", ".coffee"], aliases: ".coffee": [".coffeescript"]
  constructor: (options = {}) ->
    @root       = options.root
    @extensions = @_normalizeExtensions(options.extensions)
    @aliases    = @_normalizeAliases(options.aliases || {})
    @paths      = @_normalizePaths(options.paths)
    @patterns   = {}
    @_entries   = {}
  
  # find "application", ["./app/assets"]
  # 
  # use this method to find the string for a helper method, not to find the actual file
  find: (source) ->
    source  = source.replace(/(?:\/\.{2}\/|^\/)/g, "")
    result  = []
    root    = @root
    
    paths   = if source[0] == "." then [Metro.Support.Path.absolutePath(source, root)] else @paths.map (path) -> Metro.Support.Path.join(path, source)
    
    for path in paths
      directory = Metro.Support.Path.dirname path
      basename  = Metro.Support.Path.basename path
      
      # in case they try to use "../../.." to get to a directory that's not supposed to be accessed.
      if @pathsInclude(directory)
        result = result.concat @match(directory, basename)
    
    result
    
  pathsInclude: (directory) ->
    for path in @paths
      if path.substr(0, directory.length) == directory
        return true
    false
    
  match: (directory, basename) ->
    entries = @entries(directory)
    pattern = @pattern(basename)
    matches = []
    
    for entry in entries
      if Metro.Support.Path.isFile(Metro.Support.Path.join(directory, entry)) && !!entry.match(pattern)
        matches.push(entry)
      
    matches = @sort(matches, basename)
    for match, i in matches
      matches[i] = Metro.Support.Path.join(directory, match)
    
    matches
    
  sort: (matches, basename) ->
    matches
    
  _normalizePaths: (paths) ->
    result = []
    
    for path in paths
      if path != ".." and path != "."
        result.push Metro.Support.Path.absolutePath path, @root
    result
    
  _normalizeExtension: (extension) ->
    extension.replace(/^\.?/, ".")
    
  _normalizeExtensions: (extensions) ->
    result = []
    for extension in extensions
      result.push @_normalizeExtension(extension)
    result
    
  _normalizeAliases: (aliases) ->
    return null unless aliases
    result = {}
    for key, value of aliases
      result[@_normalizeExtension(key)] = @_normalizeExtensions(value)
    result
  
  # RegExp.escape
  escape: (string) ->
    string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    
  escapeEach: ->
    result = []
    args   = arguments[0]
    for item, i in args
      result[i] = @escape(item)
    result
    
  # A cached version of `Dir.entries` that filters out `.` files and
  # `~` swap files. Returns an empty `Array` if the directory does
  # not exist.
  entries: (path) ->
    unless @_entries[path]
      result  = []
      if Metro.Support.Path.exists(path)
        entries = Metro.Support.Path.entries(path)
      else
        entries = []
      
      for entry in entries
        result.push(entry) unless entry.match(/^\.|~$|^\#.*\#$/)
      
      @_entries[path] = result.sort()
    
    @_entries[path]
    
  pattern: (source) ->
    @patterns[source] ?= @buildPattern(source)
  
  # Returns a `Regexp` that matches the allowed extensions.
  #
  #     buildPattern("index.html") #=> /^index(.html|.htm)(.builder|.erb)*$/  
  buildPattern: (source) ->
    extension   = Metro.Support.Path.extname(source)
    
    slug        = Metro.Support.Path.basename(source, extension)
    extensions  = [extension]
    extensions  = extensions.concat @aliases[extension] if @aliases[extension]
    
    new RegExp "^" + @escape(slug) + "(?:" + @escapeEach(extensions).join("|") + ").*"
    

class Metro.Support.Naming
  

Metro.Support.Number = 
  isInt: (n) -> 
    # typeof(n) == 'number' && n % 1 == 0
    n == +n && n == (n|0)
  
  isFloat: (n) ->
    # typeof(n) == 'number' && n % 1 != 0
    n == +n && n != (n|0)


_ = require('underscore')

Metro.Support.Object =
  isA: (object, isa) ->
    
  isHash: ->
    object = arguments[0] || @
    _.isObject(object) && !(_.isFunction(object) || _.isArray(object))
  
  isPresent: (object) ->
    for key, value of object
      return true
    return false
  
  isBlank: (object) ->
    for key, value of object
      return false
    return true
  

Metro.Support.RegExp =
  escape: (string) ->
    string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    
  escapeEach: ->
    result = []
    args   = arguments[0]
    for item, i in args
      result[i] = @escape(item)
    result
    

_ = require("underscore")
_.mixin(require("underscore.string"))
lingo = require("lingo").en

Metro.Support.String =
  camelize: -> 
    _.camelize("_#{arguments[0] || @}")
    
  constantize: ->
    global[@camelize(arguments...)]
    
  underscore: ->
    _.underscored(arguments[0] || @)
    
  titleize: ->
    _.titleize(arguments[0] || @)
  

# https://github.com/timrwood/moment
# http://momentjs.com/docs/
class Metro.Support.Time
  @_lib: ->
    require 'moment'
  
  @zone: ->
    #Metro.Support.Time.TimeWithZone
    @
  
  @now: ->
    new @()
    
  constructor: ->
    @moment = @constructor._lib()()
    
  toString: ->
    @_date.toString()
    
  beginningOfWeek: ->
    
  week: ->
    parseInt(@moment.format("w"))
    
  dayOfWeek: ->
    @moment.day()
    
  dayOfMonth: ->
    parseInt(@moment.format("D"))
  
  dayOfYear: ->
    parseInt(@moment.format("DDD"))
    
  meridiem: ->
    @moment.format("a")
    
  zoneName: ->
    @moment.format("z")
    
  strftime: (format) ->
    @moment.format(format)
  
  beginningOfDay: ->
    @moment.seconds(0)
    @
    
  beginningOfWeek: ->
    @moment.seconds(0)
    @moment.subtract('days', 6 - @dayOfWeek())
    @
  
  beginningOfMonth: ->
    @moment.seconds(0)
    @moment.subtract('days', 6 - @dayOfMonth())
    @
    
  beginningOfYear: ->
    @moment.seconds(0)
    @moment.subtract('days', 6 - @dayOfMonth())
    
  toDate: ->
    @moment._d

class Metro.Support.Time.TimeWithZone extends Metro.Support.Time
  
  

Metro.Support = {}

require './support/array'
require './support/class'
require './support/callbacks'
require './support/concern'
require './support/dependencies'
require './support/ie'
require './support/i18n'
require './support/lookup'
require './support/number'
require './support/object'
require './support/path'
require './support/string'
require './support/regexp'
require './support/time'


class Field

class Form
  

class Input
  
class Link extends Metro.Components.Base
  render: ->
    
class Helpers
  #["form", "table"].each ->
  #  klass = "Metro.Components.#{this.toUpperCase()}"
  #  @::["#{this}_for"] = -> global[klass].new(arguments...).render()
    
  stylesheetLinkTag: (source) ->
    "<link href=\"#{@assetPath(source, directory: Metro.Assets.stylesheetDirectory, ext: "css")}\"></link>"
    
  assetPath: (source, options = {}) ->
    if options.digest == undefined
      options.digest = !!Metro.env.match(/(development|test)/) 
    Metro.Application.assets().computePublicPath(source, options)
    
  javascriptIncludeTag: (path) ->
    
  titleTag: (title) ->
    "<title>#{title}</title>"
    
  metaTag: (name, content) ->
    
  tag: (name, options) ->
  
  linkTag: (title, path, options) ->
    
  imageTag: (path, options) ->
    

class Metro.View.Lookup
  @initialize: ->
    @resolveLoadPaths()
    @resolveTemplatePaths()
    Metro.Support.Dependencies.load("#{Metro.root}/app/helpers")
    
  @teardown: ->
  
  @resolveLoadPaths: ->
    file = Metro.Support.Path
    @loadPaths = _.map @loadPaths, (path) -> file.expandPath(path)
    
  @lookup: (view) ->  
    pathsByName = Metro.View.pathsByName
    result    = pathsByName[view]
    return result if result
    templates = Metro.View.paths
    pattern   = new RegExp(view + "$", "i")
    
    for template in templates
      if template.split(".")[0].match(pattern)
        pathsByName[view] = template
        return template
        
    return null
  
  @resolveTemplatePaths: ->
    file           = require("file")
    templatePaths = @paths
    
    for path in Metro.View.loadPaths
      file.walkSync path, (_path, _directories, _files) ->
        for _file in _files
          template = [_path, _file].join("/")
          templatePaths.push template if templatePaths.indexOf(template) == -1      
    
    templatePaths
  
  @loadPaths:       ["./spec/spec-app/app/views"]
  @paths:           []
  @pathsByName:     {}
  @engine:          "jade"
  @prettyPrint:     false


class Rendering    
  render: ->  
    args = Array.prototype.slice.call(arguments, 0, arguments.length)
    
    unless args.length >= 2 && typeof(args[args.length - 1]) == "function"
      throw new Error("You must pass a callback to the render method")
    
    callback = args.pop()
    
    if args.length == 1
      if typeof(args[0]) == "string"
        options = template: args[0]
      else
        options = args[0]
    else
      template  = args[0]
      options   = args[1]
      options.template = template
    
    options  ?= {}
    options.locals = @context(options)
    options.type ?= Metro.View.engine
    options.engine = Metro.engine(options.type)
    if options.hasOwnProperty("layout") && options.layout == false
      options.layout = false
    else
      options.layout = options.layout || @controller.layout()
      
    self = @
    
    @_renderBody options, (error, body) ->
      self._renderLayout(body, options, callback)
    
  _renderBody: (options, callback) ->
    if options.text
      callback(null, options.text)
    else if options.json
      callback(null, if typeof(options.json) == "string" then options.json else JSON.stringify(options.json))
    else
      unless options.inline
        template = Metro.View.lookup(options.template)
        template = Metro.Support.Path.read(template)
      options.engine.render(template, options.locals, callback)
  
  _renderLayout: (body, options, callback) ->
    if options.layout
      layout  = Metro.View.lookup("layouts/#{options.layout}")
      layout  = Metro.Support.Path.read(layout)
      options.locals.yield = body
      
      options.engine.render(layout, options.locals, callback)
    else
      callback(null, body)
  
  context: (options) ->
    controller = @controller
    locals = {}
    for key of controller
      locals[key] = controller[key] unless key == "constructor"
    locals  = require("underscore").extend(locals, @locals || {}, options.locals)
    
    locals.pretty = true if Metro.View.prettyPrint
    
    locals
  

class Metro.View  
  constructor: (controller) ->
    @controller = controller || (new Metro.Controller)

require './view/helpers'
require './view/lookup'
require './view/rendering'

Metro.View.include Metro.View.Lookup
Metro.View.include Metro.View.Rendering


global._ = require 'underscore'
_.mixin(require("underscore.string"))

require './metro/support'
require './metro/asset'
require './metro/application'
require './metro/store'
require './metro/model'
require './metro/view'
require './metro/controller'
require './metro/route'
require './metro/presenter'
require './metro/middleware'
require './metro/command'
require './metro/generator'
require './metro/spec'

Metro.configuration   = null
Metro.logger          = new (require("common-logger"))(colorized: true)
Metro.root            = process.cwd()
Metro.publicPath     = process.cwd() + "/public"
Metro.env             = "test"
Metro.port            = 1597
Metro.cache           = null
Metro.version         = "0.2.0"
Metro.configure = (callback) ->
  callback.apply(@)

Metro.env = -> 
  process.env()

Metro.application = Metro.Application.instance

Metro.globalize = ->
  # add it to the function prototype!
  for key, value of Metro.Support.Class
    Function.prototype[key] = value

Metro.raise = ->
  args    = Array.prototype.slice.call(arguments)
  path    = args.shift().split(".")
  message = Metro.locale.en
  message = message[node] for node in path
  i       = 0
  message = message.replace /%s/g, -> args[i++]
    #object = args[i++]
    #if typeof(object) == "string" then object else require('util').inspect(object)
  throw new Error(message)
  
Metro.initialize  = Metro.Application.initialize
Metro.teardown    = Metro.Application.teardown

# http://nodejs.org/docs/v0.3.1/api/http.html#response.headers
Metro.get = ->
  Metro.application().client().get

Metro.locale =
  en:
    errors:
      missingCallback: "You must pass a callback to %s."
      missingOption: "You must pass in the '%s' option to %s."
      notFound: "%s not found."
      store:
        missingAttribute: "Missing %s in %s for '%s'"
      asset:
        notFound: "Asset not found: '%s'\n  Lookup paths: [\n%s\n  ]"

Metro.engine = (extension) ->
  @_engine ?= {}
  @_engine[extension] ?= switch extension
    when "less" then new (require("shift").Less)
    when "styl", "stylus" then new (require("shift").Stylus)
    when "coffee", "coffee-script" then new (require("shift").CoffeeScript)
    when "jade" then new (require("shift").Jade)
    when "mustache" then new (require("shift").Mustache)

