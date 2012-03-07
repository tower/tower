class Tower.HTTP.Route.DSL
  constructor: ->
    @_scope = {}

  match: ->
    @scope ||= {}
    Tower.HTTP.Route.create(new Tower.HTTP.Route(@_extractOptions(arguments...)))

  get: ->
    @matchMethod("get", Tower.Support.Array.args(arguments))

  post: ->
    @matchMethod("post", Tower.Support.Array.args(arguments))

  put: ->
    @matchMethod("put", Tower.Support.Array.args(arguments))

  delete: ->
    @matchMethod("delete", Tower.Support.Array.args(arguments))

  matchMethod: (method, args) ->
    if typeof args[args.length - 1] == "object"
      options       = args.pop()
    else
      options       = {}

    name            = args.shift()
    options.method  = method
    options.action  = name
    options.name    = name
    if @_scope.name
      options.name = @_scope.name + Tower.Support.String.camelize(options.name)

    path = "/#{name}"
    path = @_scope.path + path if @_scope.path

    @match(path, options)
    @

  scope: (options = {}, block) ->
    originalScope = @_scope ||= {}
    @_scope = Tower.Support.Object.extend {}, originalScope, options
    block.call(@)
    @_scope = originalScope
    @

  controller: (controller, options, block) ->
    options.controller = controller
    @scope(options, block)
  
  namespace: (path, options, block) ->
    if typeof options == 'function'
      block     = options
      options   = {}
    else
      options   = {}

    options = Tower.Support.Object.extend(name: path, path: path, as: path, module: path, shallowPath: path, shallowPrefix: path, options)

    if options.name && @_scope.name
      options.name = @_scope.name + Tower.Support.String.camelize(options.name)

    @scope(options, block)
  
  constraints: (options, block) ->
    @scope(constraints: options, block)
  
  defaults: (options, block) ->
    @scope(defaults: options, block)
  
  resource: (name, options = {}) ->
    options.controller = name
    @match "#{name}/new", Tower.Support.Object.extend({action: "new"}, options)
    @match "#{name}", Tower.Support.Object.extend({action: "create", method: "POST"}, options)
    @match "#{name}/", Tower.Support.Object.extend({action: "show"}, options)
    @match "#{name}/edit", Tower.Support.Object.extend({action: "edit"}, options)
    @match "#{name}", Tower.Support.Object.extend({action: "update", method: "PUT"}, options)
    @match "#{name}", Tower.Support.Object.extend({action: "destroy", method: "DELETE"}, options)
  
  resources: (name, options, callback) ->
    if typeof options == 'function'
      callback = options
      options  = {}
    else
      options  = {}
    options.controller ||= name

    path = "/#{name}"
    path = @_scope.path + path if @_scope.path

    if @_scope.name
      many = @_scope.name + Tower.Support.String.camelize(name)
    else
      many = name

    one   = Tower.Support.String.singularize(many)

    @match "#{path}", Tower.Support.Object.extend({name: "#{many}", action: "index"}, options)
    @match "#{path}/new", Tower.Support.Object.extend({name: "new#{Tower.Support.String.camelize(one)}", action: "new"}, options)
    @match "#{path}", Tower.Support.Object.extend({action: "create", method: "POST"}, options)
    @match "#{path}/:id", Tower.Support.Object.extend({name: "#{one}", action: "show"}, options)
    @match "#{path}/:id/edit", Tower.Support.Object.extend({name: "edit#{Tower.Support.String.camelize(one)}", action: "edit"}, options)
    @match "#{path}/:id", Tower.Support.Object.extend({action: "update", method: "PUT"}, options)
    @match "#{path}/:id", Tower.Support.Object.extend({action: "destroy", method: "DELETE"}, options)

    if callback
      @scope Tower.Support.Object.extend({path: "#{path}/:#{Tower.Support.String.singularize(name)}Id", name: one}, options), callback
    @
  
  collection: ->
  
  member: ->

  root: (options) ->
    @match '/', Tower.Support.Object.extend(as: "root", options)

  _extractOptions: ->
    args            = Tower.Support.Array.args(arguments)
    path            = "/" + args.shift().replace(/^\/|\/$/, "")

    if typeof args[args.length - 1] == "object"
      options       = args.pop()
    else
      options       = {}

    options.to      ||= args.shift() if args.length > 0
    options.path    = path
    format          = @_extractFormat(options)
    options.path    = @_extractPath(options)
    method          = @_extractRequestMethod(options)
    constraints     = @_extractConstraints(options)
    defaults        = @_extractDefaults(options)
    controller      = @_extractController(options)
    anchor          = @_extractAnchor(options)
    name            = @_extractName(options)

    options         = Tower.Support.Object.extend options,
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
    options.as || options.name

  _extractConstraints: (options) ->
    Tower.Support.Object.extend(@_scope.constraints || {}, options.constraints || {})

  _extractDefaults: (options) ->
    options.defaults || {}

  _extractPath: (options) ->
    "#{options.path}.:format?"

  _extractRequestMethod: (options) ->
    (options.method || options.via || "GET").toUpperCase()

  _extractAnchor: (options) ->
    options.anchor

  _extractController: (options = {}) ->
    to = options.to
    if to
      to = to.split('#')
      if to.length == 1
        action = to[0]
      else
        controller  = to[0]
        action      = to[1]

    controller   ||= options.controller || @_scope.controller
    action       ||= options.action

    throw new Error("No controller was specified for the route #{options.path}") unless controller

    controller  = controller.toLowerCase().replace(/(?:[cC]ontroller)?$/, "Controller")
    #action      = action.toLowerCase()

    name: controller, action: action, className: Tower.Support.String.camelize("#{controller}")
      
module.exports = Tower.Route.DSL
