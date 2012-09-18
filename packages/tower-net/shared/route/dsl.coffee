_ = Tower._

class Tower.NetRouteDSL
  constructor: ->
    @_scope = {}

  match: ->
    @scope ||= {}
    route = new Tower.NetRoute(@_extractOptions(arguments...))
    Tower.NetRoute.create(route)

  get: ->
    @matchMethod("get", _.args(arguments))

  post: ->
    @matchMethod("post", _.args(arguments))

  put: ->
    @matchMethod("put", _.args(arguments))

  delete: ->
    @matchMethod("delete", _.args(arguments))

  destroy: @::delete

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
      options.name = @_scope.name + _.camelize(options.name)

    path = "/#{name}"
    path = @_scope.path + path if @_scope.path

    @match(path, options)
    @

  scope: (options = {}, block) ->
    originalScope = @_scope ||= {}
    @_scope       = _.extend({}, originalScope, options)
    block.call(@)
    @_scope       = originalScope
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
      options.name = @_scope.name + _.camelize(options.name)

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
      name = @_scope.name + _.camelize(name)

    camelName = _.camelize(name)

    @match "#{path}/new",   _.extend(action: "new",     state: "#{name}.new",     name: "new#{camelName}", options)
    @match path,            _.extend(action: "create",  state: "#{name}.create",  method: "POST", options)
    @match path,            _.extend(action: "show",    state: "#{name}.show",    name: name, options)
    @match "#{path}/edit",  _.extend(action: "edit",    state: "#{name}.edit",    name:"edit#{camelName}", options)
    @match path,            _.extend(action: "update",  state: "#{name}.update",  method: "PUT", options)
    @match path,            _.extend(action: "destroy", state: "#{name}.destroy", method: "DELETE", options)

  resources: (name, options, block) ->
    console.log('resouces');
    if typeof options == 'function'
      block     = options
      options   = {}
    else
      options   = {}
    options.controller ||= name

    path = "/#{name}"
    path = @_scope.path + path if @_scope.path

    if @_scope.name
      many = @_scope.name + _.camelize(name)
    else
      many = name

    one   = _.singularize(many)

    camelOne = _.camelize(one)

    @match path,                _.extend(action: "index",   state: "#{many}.index",   name: many, method: ['GET'], options)
    @match "#{path}/new",       _.extend(action: "new",     state: "#{many}.new",     name: "new#{camelOne}", options)
    @match path,                _.extend(action: "create",  state: "#{many}.create",  method: "POST", options)
    @match "#{path}/:id",       _.extend(action: "show",    state: "#{many}.show",    name: one, options)
    @match "#{path}/:id/edit",  _.extend(action: "edit",    state: "#{many}.edit",    name: "edit#{camelOne}", options)
    @match "#{path}/:id",       _.extend(action: "update",  state: "#{many}.update",  method: "PUT", options)
    @match "#{path}/:id",       _.extend(action: "destroy", state: "#{many}.destroy", method: "DELETE", options)

    if block
      @scope _.extend(path: "#{path}/:#{_.singularize(name)}Id", name: one, options), block

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
      state:          options.state

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
    options.method || options.via || "GET"

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

    controller  = _.camelize(controller).replace(/(?:[cC]ontroller)?$/, "Controller")

    name: controller, action: action, className: controller

module.exports = Tower.RouteDSL
