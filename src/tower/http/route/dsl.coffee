class Tower.HTTP.Route.DSL
  constructor: ->
    @_scope = {}

  match: ->
    @scope ||= {}
    Tower.HTTP.Route.create(new Tower.HTTP.Route(@_extractOptions(arguments...)))

  get: ->
    @matchMethod("get", _.args(arguments))

  post: ->
    @matchMethod("post", _.args(arguments))

  put: ->
    @matchMethod("put", _.args(arguments))

  delete: ->
    @matchMethod("delete", _.args(arguments))

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
    @_scope = _.extend {}, originalScope, options
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

    options = _.extend(name: path, path: path, as: path, module: path, shallowPath: path, shallowPrefix: path, options)

    if options.name && @_scope.name
      options.name = @_scope.name + Tower.Support.String.camelize(options.name)

    @scope(options, block)

  constraints: (options, block) ->
    @scope(constraints: options, block)

  defaults: (options, block) ->
    @scope(defaults: options, block)

  resource: (name, options = {}) ->
    options.controller = name
    path = "/#{name}"
    path = @_scope.path + path if @_scope.path

    if @_scope.name
      name = @_scope.name + Tower.Support.String.camelize(name)

    @match "#{path}/new", _.extend({name: "new#{Tower.Support.String.camelize(name)}", action: "new"}, options)
    @match "#{path}", _.extend({action: "create", method: "POST"}, options)
    @match "#{path}", _.extend({name:name, action: "show"}, options)
    @match "#{path}/edit", _.extend({name:"edit#{Tower.Support.String.camelize(name)}", action: "edit"}, options)
    @match "#{path}", _.extend({action: "update", method: "PUT"}, options)
    @match "#{path}", _.extend({action: "destroy", method: "DELETE"}, options)

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

    @match "#{path}", _.extend({name: "#{many}", action: "index"}, options)
    @match "#{path}/new", _.extend({name: "new#{Tower.Support.String.camelize(one)}", action: "new"}, options)
    @match "#{path}", _.extend({action: "create", method: "POST"}, options)
    @match "#{path}/:id", _.extend({name: "#{one}", action: "show"}, options)
    @match "#{path}/:id/edit", _.extend({name: "edit#{Tower.Support.String.camelize(one)}", action: "edit"}, options)
    @match "#{path}/:id", _.extend({action: "update", method: "PUT"}, options)
    @match "#{path}/:id", _.extend({action: "destroy", method: "DELETE"}, options)

    if callback
      @scope _.extend({path: "#{path}/:#{Tower.Support.String.singularize(name)}Id", name: one}, options), callback
    @

  collection: ->

  member: ->

  root: (options) ->
    @match '/', _.extend(as: "root", options)

  _extractOptions: ->
    args            = _.args(arguments)
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
    options.as || options.name

  _extractConstraints: (options) ->
    _.extend(@_scope.constraints || {}, options.constraints || {})

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
