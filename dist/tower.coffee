
window.global       ||= window
module                = global.module || {}
global.Tower = Tower  = {}
Tower.version         = "0.3.0"
Tower.logger          = console

require './support'
require './application'
require './client/application'
require './store'
require './client/store'
require './model'
require './view'
require './client/view'
require './controller'
require './client/controller'
require './http'
require './middleware'

class Tower.Controller extends Tower.Class
  @include  Tower.Support.Callbacks
  @extend   Tower.Support.EventEmitter
  @include  Tower.Support.EventEmitter
  
  @instance: ->
    @_instance ||= new @
    
  @metadata: ->
    @_metadata ||= {}
  
  constructor: ->
    @constructor._instance = @
    @headers              = {}
    @status               = 200
    @request              = null
    @response             = null
    @params               = {}
    @query                = {}
    @resourceName         = @constructor.resourceName()
    @resourceType         = @constructor.resourceType()
    @collectionName       = @constructor.collectionName()
    @formats              = _.keys(@constructor.mimes())
    
    if @constructor._belongsTo
      @hasParent          = true
    else
      @hasParent          = false

require './controller/callbacks'
require './controller/helpers'
require './controller/instrumentation'
require './controller/params'
require './controller/redirecting'
require './controller/rendering'
require './controller/resourceful'
require './controller/responder'
require './controller/responding'

Tower.Controller.include Tower.Controller.Callbacks
Tower.Controller.include Tower.Controller.Helpers
Tower.Controller.include Tower.Controller.Instrumentation
Tower.Controller.include Tower.Controller.Params
Tower.Controller.include Tower.Controller.Redirecting
Tower.Controller.include Tower.Controller.Rendering
Tower.Controller.include Tower.Controller.Resourceful
Tower.Controller.include Tower.Controller.Responding


Tower.HTTP = {}

require './http/agent'
require './http/cookies'
require './http/param'
require './http/route'
require './http/request'
require './http/response'
require './http/url'


class Tower.Model extends Tower.Class
  # @example All configuration options
  #   class App.User extends Tower.Model
  #     @configure 
  # 
  # @example Configure using a function
  #   class App.User extends Tower.Model
  #     @configure ->
  #       defaultStore: Tower.Store.Memory
  @configure: (object) ->
    @config ||= {}
    object = object.call @ if typeof object == "function"
    _.extend @config, object
    @
  
  # @example All default options
  #   class App.User extends Tower.Model
  #     @defaults store: Tower.Store.Memory, scope: @desc("createdAt")
  @defaults: (object) ->
    @default(key, value) for key, value of object
    @_defaults
    
  # @example All default options 
  #   class App.User extends Tower.Model
  #     @default "store", Tower.Store.Memory
  #     @default "scope", @desc("createdAt")
  @default: (key, value) ->
    @_defaults ||= {}
    @_defaults[key] = value
    
  constructor: (attrs, options) ->
    @initialize attrs, options
    
  initialize: (attrs = {}, options = {}) ->  
    definitions = @constructor.fields()
    attributes  = {}
    
    for name, definition of definitions
      attributes[name] = definition.defaultValue(@) unless attrs.hasOwnProperty(name)

    @attributes   = attributes
    @changes      = {}
    @errors       = {}
    @readOnly     = if options.hasOwnProperty("readOnly") then options.readOnly else false
    @persistent   = if options.hasOwnProperty("persistent") then options.persisted else false

    @attributes[key] = value for key, value of attrs
  
require './model/scope'
require './model/criteria'
require './model/dirty'
require './model/conversion'
require './model/inheritance'
require './model/relation'
require './model/relations'
require './model/attribute'
require './model/attributes'
require './model/persistence'
require './model/scopes'
require './model/serialization'
require './model/validator'
require './model/validations'
require './model/timestamp'
require './model/locale/en'

Tower.Model.include Tower.Support.Callbacks
Tower.Model.include Tower.Model.Conversion
Tower.Model.include Tower.Model.Dirty
Tower.Model.include Tower.Model.Criteria
Tower.Model.include Tower.Model.Scopes
Tower.Model.include Tower.Model.Persistence
Tower.Model.include Tower.Model.Inheritance
Tower.Model.include Tower.Model.Serialization
Tower.Model.include Tower.Model.Relations
Tower.Model.include Tower.Model.Validations
Tower.Model.include Tower.Model.Attributes
Tower.Model.include Tower.Model.Timestamp


require 'underscore.logger'

global._ = require 'underscore'
_.mixin(require('underscore.string'))

Tower.version = JSON.parse(require("fs").readFileSync(require("path").normalize("#{__dirname}/../../package.json"))).version

Tower.logger    = _console

require './support'
require './application'
require './server/application'
require './store'
require './server/store'
require './model'
require './view'
require './controller'
require './server/controller'
require './http'
require './middleware'
require './server/middleware'
require './server/command'
require './server/generator'

Tower.Model.defaultStore  = Tower.Store.MongoDB
Tower.View.store(new Tower.Store.FileSystem(["app/views"]))
Tower.root                = process.cwd()
Tower.publicPath          = process.cwd() + "/public"
Tower.publicCacheDuration = 60 * 1000
Tower.sessionSecret       = "tower-session-secret"
Tower.cookieSecret        = "tower-cookie-secret"
Tower.render              = (string, options = {}) ->
  require("mint").render(options.type, string, options)
  
Tower.domain              = "localhost"

Tower.date = ->
  require('moment')(arguments...)._d

Tower.run = (argv) ->
  (new Tower.Command.Server(argv)).run()


Tower.Support = {}

require './support/array'
require './support/callbacks'
require './support/class'
require './support/eventEmitter'
require './support/i18n'
require './support/number'
require './support/object'
require './support/regexp'
require './support/string'
require './support/url'
require './support/locale/en'


class Tower.View extends Tower.Class
  @extend
    cache:                                      {}
    engine:                                     "coffee"
    prettyPrint:                                false
    loadPaths:                                  ["app/views"]
    componentSuffix:                            "widget"
    hintClass:                                  "hint"
    hintTag:                                    "figure"
    labelClass:                                 "label"
    requiredClass:                              "required"
    requiredAbbr:                               "*"
    requiredTitle:                              "Required"
    errorClass:                                 "error"
    errorTag:                                   "output"
    validClass:                                 null
    optionalClass:                              "optional"
    optionalAbbr:                               ""
    optionalTitle:                              "Optional"
    labelMethod:                                "humanize"
    labelAttribute:                             "toLabel"
    validationMaxLimit:                         255
    defaultTextFieldSize:                       null
    defaultTextAreaWidth:                       300
    allFieldsRequiredByDefault:                 true
    fieldListTag:                               "ol"
    fieldListClass:                             "fields"
    fieldTag:                                   "li"
    separator:                                  "-"
    breadcrumb:                                 " - "
    includeBlankForSelectByDefault:             true
    collectionLabelMethods:                     ["toLabel", "displayName", "fullName", "name", "title", "toString"]
    i18nLookupsByDefault:                       true
    escapeHtmlEntitiesInHintsAndLabels:         false
    renameNestedAttributes:                     true
    inlineValidations:                          true
    autoIdForm:                                 true
    fieldsetClass:                              "fieldset"
    fieldClass:                                 "field"
    validateClass:                              "validate"
    legendClass:                                "legend"
    formClass:                                  "form"
    idEnabledOn:                                ["input", "field"] # %w(field label error hint)
    widgetsPath:                                "shared/widgets"
    navClass:                                   "list-item"
    includeAria:                                true
    activeClass:                                "active"
    navTag:                                     "li"
    termsTag:                                   "dl"
    termClass:                                  "term"
    termKeyClass:                               "key"
    termValueClass:                             "value"
    hintIsPopup:                                false
    listTag:                                    "ul"
    pageHeaderId:                               "header"
    pageTitleId:                                "title"
    autoIdNav:                                  false
    pageSubtitleId:                             "subtitle"
    widgetClass:                                "widget"
    headerClass:                                "header"
    titleClass:                                 "title"
    subtitleClass:                              "subtitle"
    contentClass:                               "content"
    defaultHeaderLevel:                         3
    termSeparator:                              ":"
    richInput:                                  false
    submitFieldsetClass:                        "submit-fieldset"
    addLabel:                                   "+"
    removeLabel:                                "-"
    cycleFields:                                false
    alwaysIncludeHintTag:                       false
    alwaysIncludeErrorTag:                      true
    requireIfValidatesPresence:                 true
    localizeWithNamespace:                      false
    localizeWithNestedModel:                    false
    localizeWithInheritance:                    true
    defaultComponentHeaderLevel:                3
    helpers:                                    []
    metaTags: [
      "description",
      "keywords",
      "author",
      "copyright",
      "category",
      "robots"
    ]
    store: (store) ->
      @_store = store if store
      @_store ||= new Tower.Store.Memory(name: "view")
    renderers: {}
  
  constructor: (context = {}) ->
    @_context = context

require './view/helpers'
require './view/rendering'
require './view/component'
require './view/table'
require './view/form'
require './view/helpers/assetHelper'
require './view/helpers/componentHelper'
require './view/helpers/elementHelper'
require './view/helpers/headHelper'
require './view/helpers/renderingHelper'
require './view/helpers/stringHelper'

Tower.View.include Tower.View.Rendering
Tower.View.include Tower.View.Helpers
Tower.View.include Tower.View.AssetHelper
Tower.View.include Tower.View.ComponentHelper
Tower.View.include Tower.View.HeadHelper
Tower.View.include Tower.View.RenderingHelper
Tower.View.include Tower.View.StringHelper

Tower.View.helpers.push Tower.View.AssetHelper
Tower.View.helpers.push Tower.View.ComponentHelper
Tower.View.helpers.push Tower.View.HeadHelper
Tower.View.helpers.push Tower.View.RenderingHelper
Tower.View.helpers.push Tower.View.StringHelper


require './controller/elements'
require './controller/events'
require './controller/handlers'

Tower.Controller.include Tower.Controller.Elements
Tower.Controller.include Tower.Controller.Events
Tower.Controller.include Tower.Controller.Handlers

$.fn.serializeParams = (coerce) ->
  $.serializeParams($(this).serialize(), coerce)
  
$.serializeParams = (params, coerce) ->
  obj = {}
  coerce_types =
    true: not 0
    false: not 1
    null: null
  
  array = params.replace(/\+/g, " ").split("&")
  
  for item, index in array
    param = item.split("=")
    key = decodeURIComponent(param[0])
    val = undefined
    cur = obj
    i = 0
    keys = key.split("][")
    keys_last = keys.length - 1
    if /\[/.test(keys[0]) and /\]$/.test(keys[keys_last])
      keys[keys_last] = keys[keys_last].replace(/\]$/, "")
      keys = keys.shift().split("[").concat(keys)
      keys_last = keys.length - 1
    else
      keys_last = 0
    if param.length is 2
      val = decodeURIComponent(param[1])
      val = (if val and not isNaN(val) then +val else (if val is "undefined" then `undefined` else (if coerce_types[val] isnt `undefined` then coerce_types[val] else val)))  if coerce
      if keys_last
        while i <= keys_last
          key = (if keys[i] is "" then cur.length else keys[i])
          cur = cur[key] = (if i < keys_last then cur[key] or (if keys[i + 1] and isNaN(keys[i + 1]) then {} else []) else val)
          i++
      else
        if $.isArray(obj[key])
          obj[key].push val
        else if obj[key] isnt `undefined`
          obj[key] = [ obj[key], val ]
        else
          obj[key] = val
    else obj[key] = (if coerce then `undefined` else "")  if key

  obj

require './view/formHelper'
require './view/metaHelper'
require './view/validationHelper'

Tower.Controller.Callbacks =
  ClassMethods:
    beforeAction: ->
      @before "action", arguments...
      
    afterAction: ->
      @after "action", arguments...


Tower.Controller.Helpers =
  ClassMethods:
    helper: (object) ->
      @_helpers ||= []
      @_helpers.push(object)
      
    layout: (layout) ->
      @_layout = layout
      
  layout: ->
    layout = @constructor._layout
    if typeof(layout) == "function" then layout.call(@) else layout


Tower.Controller.Instrumentation =
  call: (request, response, next) ->
    @request  = request
    @response = response
    @params   = @request.params   || {}
    @cookies  = @request.cookies  || {}
    @query    = @request.query    || {}
    @session  = @request.session  || {}
    @format   = @params.format    || "html"
    @action   = @params.action
    @headers  = {}
    @callback = next
    @process()
    
  process: ->
    @processQuery()
    
    # hacking in logging for now
    unless Tower.env.match(/(test|production)/)
      console.log "  Processing by #{@constructor.name}##{@action} as #{@format.toUpperCase()}"
      console.log "  Parameters:"
      console.log @params
    
    @runCallbacks "action", name: @action, (callback) =>
      @[@action].call @, callback
    
  processQuery: ->
  
  clear: ->
    @request  = null
    @response = null
    @headers  = null


Tower.Controller.Params =
  ClassMethods:
    params: (options, callback) ->
      if typeof options == 'function'
        callback  =  options
        options   = {}
      
      if options
        @_paramsOptions = Tower.Support.Object.extend(@_paramsOptions || {}, options)
        callback.call(@)
        
      @_params ||= {}
      
    param: (key, options = {}) ->  
      @_params      ||= {}
      @_params[key] = Tower.HTTP.Param.create(key, Tower.Support.Object.extend({}, @_paramsOptions || {}, options))
  
  criteria: ->
    return @_criteria if @_criteria
    
    @_criteria  = criteria = new Tower.Model.Criteria
    
    parsers     = @constructor.params()
    params      = @params
    
    for name, parser of parsers
      if params.hasOwnProperty(name)
        criteria.where(parser.toCriteria(params[name]))
        
    criteria


Tower.Controller.Redirecting =
  redirectTo: ->
    @redirect arguments...
  
  # @todo, better url extraction
  redirect: ->
    try
      args      = Tower.Support.Array.args(arguments)
      console.log "redirect"
      console.log @resourceType
      console.log args
      options   = Tower.Support.Array.extractOptions(args)
      console.log options
      url       = args.shift()
      if !url && options.hasOwnProperty("action")
        url = switch options.action
          when "index", "new"
            Tower.urlFor(@resourceType, action: options.action)
          when "edit", "show"
            Tower.urlFor(@resource, action: options.action)
      url ||= "/"
      console.log url
      @response.redirect url
    catch error
      console.log error
    @callback() if @callback
    

Tower.Controller.Rendering =
  ClassMethods:
    addRenderer: (key, block) ->
      @renderers()[key] = block
      
    addRenderers: (renderers = {}) ->
      @addRenderer(key, block) for key, block of renderers
      @
      
    renderers: ->
      @_renderers ||= {}
      
  render: ->
    @renderToBody @_normalizeRender(arguments...)
    
  renderToBody: (options) ->
    @_processRenderOptions(options)
    @_renderTemplate(options)
    
  renderToString: ->
    @renderToBody @_normalizeRender(arguments...)
    
  sendFile: (path, options = {}) ->
  
  sendData: (data, options = {}) ->
  
  _renderTemplate: (options) ->
    _callback = options.callback
    callback = (error, body) =>
      if error
        @status ||= 404
        @body   = error.stack
      else
        @status ||= 200
        @body     = body
      _callback.apply @, arguments if _callback
      @callback() if @callback
      
    return if @_handleRenderers(options, callback)
    
    @headers["Content-Type"] ||= "text/html"
    
    view    = new Tower.View(@)
    
    try
      view.render.call view, options, callback
    catch error
      callback error
    
  _handleRenderers: (options, callback) ->
    for name, renderer of Tower.Controller.renderers()
      if options.hasOwnProperty(name)
        renderer.call @, options[name], options, callback
        return true
    false
    
  _processRenderOptions: (options = {}) ->
    @status                   = options.status if options.status
    @headers["Content-Type"]  = options.contentType if options.contentType
    @headers["Location"]      = @urlFor(options.location) if options.location
    @
    
  _normalizeRender: ->
    @_normalizeOptions @_normalizeArgs(arguments...)
  
  _normalizeArgs: ->
    args = Tower.Support.Array.args(arguments)
    if typeof args[0] == "string"
      action    = args.shift()
    if typeof args[0] == "object"
      options   = args.shift()
    if typeof args[0] == "function"
      callback  = args.shift()
    
    options         ||= {}
    
    if action
      key             = if !!action.match(/\//) then "file" else "action"
      options[key]    = action
      
    options.callback  = callback if callback
    
    options
  
  _normalizeOptions: (options = {}) ->
    options.partial     = @action if options.partial == true
    options.prefixes  ||= [] 
    options.prefixes.push @collectionName
    options.template ||= (options.file || (options.action || @action))
    options


Tower.Controller.Resourceful =
  ClassMethods:
    resource: (options) ->
      @_resourceName    = options.name if options.hasOwnProperty("name")
      @_resourceType    = options.type if options.hasOwnProperty("type")
      @_collectionName  = options.collectionName if options.hasOwnProperty("collectionName")
      @
      
    resourceType: ->
      @_resourceType ||= Tower.Support.String.singularize(@name.replace(/(Controller)$/, ""))
      
    resourceName: ->
      return @_resourceName if @_resourceName
      parts = @resourceType().split(".")
      @_resourceName = Tower.Support.String.camelize(parts[parts.length - 1], true)
      
    collectionName: ->
      @_collectionName ||= Tower.Support.String.camelize(@name.replace(/(Controller)$/, ""), true)
    
    belongsTo: (key, options = {}) ->
      options.key = key
      options.type ||= Tower.Support.String.camelize(options.key)
      @_belongsTo = options
    
    actions: ->
      args = Tower.Support.Array.args(arguments)

      if typeof args[args.length - 1] == "object"
        options = args.pop()
      else
        options = {}

      actions         = ["index", "new", "create", "show", "edit", "update", "destroy"]
      actionsToRemove = _.difference(actions, args, options.except || [])

      for action in actionsToRemove
        @[action] = null
        delete @[action]

      @

  index: ->
    #@_index arguments...
    @_index (format) =>
      format.html => @render "index"
      format.json => @render json: @collection, status: 200

  new: ->
    @_new (format) =>
      format.html => @render "new"
      format.json => @render json: @resource, status: 200
  
  create: (callback) ->
    @_create (format) =>
      format.html => @redirectTo action: "show"
      format.json => @render json: @resource, status: 200
      
  show: ->
    @_show (format) =>
      format.html => @render "show"
      format.json => @render json: @resource, status: 200

  edit: ->
    @_edit (format) =>
      format.html => @render "edit"
      format.json => @render json: @resource, status: 200
      
  update: ->
    @_update (format) =>
      format.html => @redirectTo action: "show"
      format.json => @render json: @resource, status: 200
      
  destroy: ->
    @_destroy (format) =>
      format.html => @redirectTo action: "index"
      format.json => @render json: @resource, status: 200
  
  _index: (callback) ->
    @findCollection (error, collection) =>
      @respondWith collection, callback

  _new: (callback) ->
    @buildResource (error, resource) =>
      return @failure(error) unless resource
      @respondWith(resource, callback)

  _create: (callback) ->
    @buildResource (error, resource) =>
      return @failure(error, callback) unless resource
      resource.save (error) =>
        @respondWithStatus Tower.Support.Object.isBlank(resource.errors), callback
  
  _show: (callback) ->
    @findResource (error, resource) =>
      @respondWith resource, callback
      
  _edit: (callback) ->
    @findResource (error, resource) =>
      @respondWith resource, callback
  
  _update: (callback) ->
    @findResource (error, resource) =>
      return @failure(error, callback) if error
      resource.updateAttributes @params[@resourceName], (error) =>
        @respondWithStatus !!!error && Tower.Support.Object.isBlank(resource.errors), callback
  
  _destroy: (callback) ->
    @findResource (error, resource) =>
      return @failure(error, callback) if error
      resource.destroy (error) =>
        @respondWithStatus !!!error, callback
  
  respondWithScoped: (callback) ->
    @scoped (error, scope) =>
      return @failure(error, callback) if error
      @respondWith scope.build(), callback
  
  respondWithStatus: (success, callback) ->
    options = records: (@resource || @collection)
    
    if callback && callback.length > 1
      successResponder = new Tower.Controller.Responder(@, options)
      failureResponder = new Tower.Controller.Responder(@, options)
      
      callback.call @, successResponder, failureResponder
      
      if success
        successResponder[format].call @
      else
        failureResponder[format].call @, error
    else
      Tower.Controller.Responder.respond(@, options, callback)
  
  buildResource: (callback) ->
    @scoped (error, scope) =>
      return callback.call @, error, null if error
      @[@resourceName] = @resource = resource = scope.build(@params[@resourceName])
      callback.call @, null, resource if callback
      resource
    
  findResource: (callback) ->
    @scoped (error, scope) =>
      return callback.call @, error, null if error
      scope.find @params.id, (error, resource) =>
        @[@resourceName]  = @resource = resource
        callback.call @, error, resource
        
  findCollection: (callback) ->
    @scoped (error, scope) =>
      return callback.call @, error, null if error
      scope.all (error, collection) =>
        @[@collectionName]  = @collection = collection
        callback.call @, error, collection if callback
      
  findParent: (callback) ->
    association = @constructor._belongsTo
    if association
      param       = association.param || "#{association.key}Id"
      parentClass = Tower.constant(association.type)
      parentClass.find @params[param], (error, parent) =>
        throw error if error && !callback
        unless error
          @parent = @[association.key] = parent
        callback.call @, error, parent if callback
    else
      callback.call @, null, false if callback
      false

  scoped: (callback) ->
    callbackWithScope = (error, scope) =>
      callback.call @, error, scope.where(@criteria())
    
    if @hasParent
      @findParent (error, parent) =>
        callbackWithScope(error, parent[@collectionName]())
    else
      callbackWithScope null, Tower.constant(@resourceType)
      
  failure: (resource, callback) ->
    callback()


class Tower.Controller.Responder
  @respond: (controller, options, callback) ->
    responder = new @(controller, options)
    responder.respond callback
  
  constructor: (controller, options = {}) ->
    @controller       = controller
    @options          = options
    
    @accept(format) for format in @controller.formats

  accept: (format) ->
    @[format] = (callback) -> @["_#{format}"] = callback
  
  respond: (callback) ->
    callback.call @controller, @ if callback
    method  = @["_#{@controller.format}"]
    if method then method.call(@) else @toFormat()
  
  _html: ->
    @controller.render action: @controller.action
  
  _json: ->
    @controller.render json: @options.records
  
  toFormat: ->
    try
      if get? || !hasErrors?
        @defaultRender()
      else
        @displayErrors()
    catch error
      @_apiBehavior(error)
  
  _navigationBehavior: (error) ->
    if get?
      throw error
    else if hasErrors? && defaultAction
      @render action: @defaultAction
    else
      @redirectTo @navigationLocation

  _apiBehavior: (error) ->
    #throw error unless resourceful?
    
    if get?
      @display resource
    else if post?
      @display resource, status: "created", location: @apiLocation
    else
      @head "noContent"
  
  isResourceful: ->
    @resource.hasOwnProperty("to#{@format.toUpperCase()}")
  
  resourceLocation: ->
    @options.location || @resources
  
  defaultRender: ->
    @defaultResponse.call(options)
  
  display: (resource, givenOptions = {}) ->
    @controller.render _.extend givenOptions, @options, format: @resource
  
  displayErrors: ->
    @controller.render format: @resourceErrors, status: "unprocessableEntity"
  
  hasErrors: ->
    @resource.respondTo?("errors") && !@resource.errors.empty?
  
  defaultAction: ->
    @action ||= ACTIONS_FOR_VERBS[request.requestMethodSymbol]
  
  resourceErrors: ->
    if @hasOwnProperty("#{format}ResourceErrors") then @["#{format}RresourceErrors"] else @resource.errors
  
  jsonResourceErrors: ->
    errors: @resource.errors
  

Tower.Controller.Responding =
  ClassMethods:
    respondTo: ->
      mimes     = @mimes()
      args      = Tower.Support.Array.args(arguments)
      
      if typeof args[args.length - 1] == "object"
        options = args.pop()
      else
        options = {}
        
      only      = Tower.Support.Object.toArray(options.only) if options.only
      except    = Tower.Support.Object.toArray(options.except) if options.except
      
      for name in args
        mimes[name]         = {}
        mimes[name].only    = only if only
        mimes[name].except  = except if except
      
      @
      
    mimes: ->
      @_mimes ||= {json: {}, html: {}}
    
  respondTo: (block) ->
    Tower.Controller.Responder.respond(@, {}, block)
  
  respondWith: ->
    args      = Tower.Support.Array.args(arguments)
    callback  = null
    
    if typeof(args[args.length - 1]) == "function"
      callback  = args.pop()
      
    if typeof(args[args.length - 1]) == "object" && !(args[args.length - 1] instanceof Tower.Model)
      options   = args.pop()
    else
      options   = {}
    
    options ||= {}

    options.records = args[0]
    
    Tower.Controller.Responder.respond(@, options, callback)
    
  _mimesForAction: ->
    action  = @action
    
    result  = []
    mimes   = @constructor.mimes()
    
    for mime, config of mimes
      success = false
      
      if config.except
        success = !_.include(config.except, action)
      else if config.only
        success = _.include(config.only, action)
      else
        success = true
      
      result.push mime if success
      
    result
    

class Tower.HTTP.Agent
  constructor: (attributes = {}) ->
    _.extend @, attributes
    
  toJSON: ->
    family:   @family
    major:    @major
    minor:    @minor
    patch:    @patch
    version:  @version
    os:       @os
    name:     @name
    

class Tower.HTTP.Cookies
  @parse: (string = document.cookie) ->
    result  = {}
    pairs   = string.split(/[;,] */);
    
    for pair in pairs
      eqlIndex  = pair.indexOf('=')
      key       = pair.substring(0, eqlIndex).trim().toLowerCase()
      value     = pair.substring(++eqlIndex, pair.length).trim()
      
      # quoted values
      value = value.slice(1, -1) if '"' == value[0]
      
      # only assign once
      if result[key] == undefined
        value = value.replace(/\+/g, ' ')
        try
          result[key] = decodeURIComponent(value)
        catch error
          if error instanceof URIError
            result[key] = value
          else
            throw err
            
    new @(result)
    
  constructor: (attributes = {}) ->
    @[key] = value for key, value of attributes


class Tower.HTTP.Param
  @perPage:       20
  @sortDirection: "ASC"
  @sortKey:       "sort"                 # or "order", etc.
  @limitKey:      "limit"                # or "perPage", etc.
  @pageKey:       "page"
  @separator:     "_"                    # or "-"
  
  @create: (key, options) ->
    options.type ||= "String"
    new Tower.HTTP.Param[options.type](key, options)
    
  constructor: (key, options = {}) ->
    @controller = options.controller
    @key        = key
    @attribute  = options.as || @key
    @modelName  = options.modelName
    @namespace  = Tower.Support.String.pluralize(@modelName) if modelName?
    @exact      = options.exact || false
    @default    = options.default
  
  parse: (value) -> value
  
  render: (value) -> value
  
  toCriteria: (value) ->
    nodes     = @parse(value)
    criteria  = new Tower.Model.Criteria
    for set in nodes
      for node in set
        attribute   = node.attribute
        operator    = node.operators[0]
        conditions  = {}
        if operator == "$eq"
          conditions[attribute] = node.value
        else
          conditions[attribute] = {}
          conditions[attribute][operator] = node.value
          
        criteria.where(conditions)
    criteria
  
  parseValue: (value, operators) ->
    namespace: @namespace, key: @key, operators: operators, value: value, attribute: @attribute
  
  _clean: (string) ->
    string.replace(/^-/, "").replace(/^\+-/, "").replace(/^'|'$/, "").replace("+", " ").replace(/^\^/, "").replace(/\$$/, "").replace(/^\s+|\s+$/, "")

require './param/array'
require './param/date'
require './param/number'
require './param/string'


class Tower.HTTP.Request
  constructor: (data = {}) ->
    @url        = data.url
    @location   = data.location
    @pathname   = @location.path
    @query      = @location.query
    @title      = data.title
    @title    ||= document?.title
    @body       = data.body     || {}
    @headers    = data.headers  || {}
    @method     = data.method   || "GET"


class Tower.HTTP.Response
  constructor: (data = {}) ->
    @url        = data.url
    @location   = data.location
    @pathname   = @location.path
    @query      = @location.query
    @title      = data.title
    @title    ||= document?.title
    @body       = data.body     || {}
    @headers    = data.headers  || {}
    @headerSent = false
    @statusCode = 200
    @body       = ""

  writeHead: (statusCode, headers) ->
    @statusCode = statusCode
    @headers    = headers
  
  setHeader: (key, value) ->
    throw new Error("Headers already sent") if @headerSent
    @headers[key] = value

  write: (body = '') ->
    @body += body

  end: (body = '') ->
    @body       += body
    @sent       = true
    @headerSent = true
    
  redirect: (path, options = {}) ->
    global.History.push options, null, path if global.History


class Tower.HTTP.Route extends Tower.Class
  @store: ->
    @_store ||= []
  
  @create: (route) ->
    @store().push(route)
    
  @all: ->
    @store()
    
  @clear: ->
    @_store = []
  
  @draw: (callback) ->
    callback.apply(new Tower.HTTP.Route.DSL(@))
    
  @findController: (request, response, callback) ->
    routes      = Tower.Route.all()
    
    for route in routes
      controller = route.toController request
      break if controller
    
    if controller
      controller.call request, response, ->
        callback(controller)
    else
      callback(null)
    
    controller
    
  toController: (request) ->
    match = @match(request)
    
    return null unless match
    
    method  = request.method.toLowerCase()
    keys    = @keys
    params  = Tower.Support.Object.extend({}, @defaults, request.query || {}, request.body || {})
    match   = match[1..-1]
    
    for capture, i in match
      params[keys[i].name] ||= if capture then decodeURIComponent(capture) else null
    
    controller      = @controller
    params.action   = controller.action if controller
    request.params  = params
    
    controller      = new (Tower.constant(Tower.namespaced(@controller.className))) if controller
    controller
  
  constructor: (options) ->
    options     ||= options
    @path         = options.path
    @name         = options.name
    @method       = (options.method || "GET").toUpperCase()
    @ip           = options.ip
    @defaults     = options.defaults || {}
    @constraints  = options.constraints
    @options      = options
    @controller   = options.controller
    @keys         = []
    @pattern      = @extractPattern(@path)
    @id           = @path
    if @controller
      @id += @controller.name + @controller.action
    
  match: (requestOrPath) ->
    if typeof requestOrPath == "string" then return @pattern.exec(requestOrPath)
    path  = requestOrPath.location.path
    return null unless requestOrPath.method.toUpperCase() == @method
    match = @pattern.exec(path)
    return null unless match
    return null unless @matchConstraints(requestOrPath)
    match
    
  matchConstraints: (request) ->
    constraints = @constraints
    
    switch typeof(constraints)
      when "object"
        for key, value of constraints
          switch typeof(value)
            when "string", "number"
              return false unless request[key] == value
            when "function", "object"
              # regexp?
              return false unless !!request.location[key].match(value)
      when "function"
        return constraints.call(request, request)
      else
        return false
    
    return true
    
  urlFor: (options = {}) ->
    result = @path
    result = result.replace(new RegExp(":#{key}\\??", "g"), value) for key, value of options
    result = result.replace(new RegExp("\\.?:\\w+\\??", "g"), "")
    result
    
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
      
      slash   ||= ""
      result = ""
      result += slash if !optional || !splat
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
    
    new RegExp('^' + path + '$', if !!caseSensitive then '' else 'i')
  
Tower.Route = Tower.HTTP.Route

require './route/dsl'
require './route/urls'
require './route/polymorphicUrls'

Tower.HTTP.Route.include Tower.HTTP.Route.Urls
Tower.HTTP.Route.include Tower.HTTP.Route.PolymorphicUrls


Tower.HTTP.Sync =
  ajax: ->
    
  webSockets: ->
    

class Tower.HTTP.Url
  @key: ["source", "protocol", "host", "userInfo", "user", "password", "hostname", "port", "relative", "path", "directory", "file", "query", "fragment"]
  @aliases: 
    anchor: "fragment"
  @parser: 
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  
  @querystringParser: /(?:^|&|;)([^&=;]*)=?([^&;]*)/g
  @fragmentParser: /(?:^|&|;)([^&=;]*)=?([^&;]*)/g
  @typeParser: /(youtube|vimeo|eventbrite)/
  
  parse: (string) ->
    key         = @constructor.key
    string      = decodeURI(string)
    parsed      = @constructor.parser[(if @strictMode or false then "strict" else "loose")].exec(string)
    
    attributes  = {}
    @params     = params      = {}
    @fragment   = fragment    = params: {}
    
    i                           = 14
    while i--
      attributes[key[i]]          = parsed[i] || ""
    
    attributes["query"].replace @constructor.querystringParser, ($0, $1, $2) ->
      params[$1]            = $2  if $1
    
    attributes["fragment"].replace @constructor.fragmentParser, ($0, $1, $2) ->
      fragment.params[$1]   = $2  if $1
    
    @segments               = attributes.path.replace(/^\/+|\/+$/g, "").split("/")
    fragment.segments       = attributes.fragment.replace(/^\/+|\/+$/g, "").split("/")
    
    @[key]    ||= value for key, value of attributes
    @root       = (if attributes.host then attributes.protocol + "://" + attributes.hostname + (if attributes.port then ":" + attributes.port else "") else "")
    
    domains     = @hostname.split(".")
    
    @domain     = domains[(domains.length - 1 - @depth)..(domains.length - 1)].join(".")
    @subdomains = domains[0..(domains.length - 2 - @depth)]
    @subdomain  = @subdomains.join(".")
    @port       = parseInt(@port) if @port?

  constructor: (url, depth = 1, strictMode) ->
    @strictMode   = strictMode or false
    @depth        = depth || 1
    @url          = url ||= window.location.toString() if window?
    
    @parse(url)


class Tower.Model.Attribute
  constructor: (owner, name, options = {}) ->
    @owner    = owner
    @name     = key = name
    @type     = options.type || "String"
    if typeof @type != "string"
      @type   = "Array"
    @_default = options.default
    @_encode  = options.encode
    @_decode  = options.decode
    
    if Tower.accessors
      Object.defineProperty @owner.prototype, name,
        enumerable: true
        configurable: true
        get: -> @get(key)
        set: (value) -> @set(key, value)
    
  defaultValue: (record) ->
    _default = @_default
    
    if Tower.Support.Object.isArray(_default)
      _default.concat()
    else if Tower.Support.Object.isHash(_default)
      Tower.Support.Object.extend({}, _default)
    else if typeof(_default) == "function"
      _default.call(record)
    else
      _default
    
  encode: (value, binding) ->
    @code @_encode, value, binding
    
  decode: (value, binding) ->
    @code @_decode, value, binding
    
  code: (type, value, binding) ->
    switch type
      when "string"
        binding[type].call binding[type], value
      when "function"
        type.call _encode, value
      else
        value
    

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
    
  _set: (key, value) ->
    @_attributeChange(key, value)
    @attributes[key] = value
    
  assignAttributes: (attributes) ->
    for key, value of attributes
      delete @changes[key]
      @attributes[key] = value
    @
    
  has: (key) ->
    @attributes.hasOwnProperty(key)
    

Tower.Model.Conversion =
  ClassMethods:
    baseClass: ->
      if @__super__ && @__super__.constructor.baseClass && @__super__.constructor != Tower.Model
        @__super__.constructor.baseClass()
      else
        @
      
    toParam: ->
      return undefined if @ == Tower.Model
      @metadata().paramNamePlural
    
    toKey: ->
      @metadata().paramName
    
    # @url "/posts/:postId/comment"
    # @url parent: "post"
    # @url (model) -> return "/something"
    url: (options) ->
      @_url = switch typeof options
        when "object"
          if options.parent
            url = "/#{Tower.Support.String.parameterize(Tower.Support.String.pluralize(options.parent))}/:#{Tower.Support.String.camelize(options.parent, true)}/#{@toParam()}"
        else
          options

    collectionName: ->
      Tower.Support.String.camelize(Tower.Support.String.pluralize(@name), true)

    resourceName: ->
      Tower.Support.String.camelize(@name, true)
    
    # inheritance_column
    metadata: ->
      className               = @name
      metadata                = @metadata[className]
      return metadata if metadata
      namespace               = Tower.namespace()
      name                    = Tower.Support.String.camelize(className, true)
      namePlural              = Tower.Support.String.pluralize(name)
      classNamePlural         = Tower.Support.String.pluralize(className)
      paramName               = Tower.Support.String.parameterize(name)
      paramNamePlural         = Tower.Support.String.parameterize(namePlural)
      modelName               = "#{namespace}.#{className}"
      controllerName          = "#{namespace}.#{classNamePlural}Controller"
      
      @metadata[className]    =
        name:                 name
        namePlural:           namePlural
        className:            className
        classNamePlural:      classNamePlural
        paramName:            paramName
        paramNamePlural:      paramNamePlural
        modelName:            modelName
        controllerName:       controllerName
  
  toLabel: ->
    @className()
  
  toPath: ->
    result  = @constructor.toParam()
    return "/" if result == undefined
    param   = @toParam()
    result += "/#{param}" if param
    result
  
  toParam: ->
    id = @get("id")
    if id? then String(id) else null
    
  toKey: ->
    @constructor.tokey()
    
  toCacheKey: ->
  
  toModel: ->
    @
    
  metadata: ->
    @constructor.metadata()


class Tower.Model.Criteria
  constructor: (args = {}) ->
    @[key] = value for key, value of args
    @_where ||= []
    @_order ||= []
  
  where: (conditions) ->
    if conditions instanceof Tower.Model.Criteria
      @merge(conditions)
    else
      @_where.push(conditions)
    
  order: (attribute, direction = "asc") ->
    @_order ||= []
    @_order.push [attribute, direction]
    #@mergeOptions sort: [[attribute, direction]]
    
  asc: (attributes...) ->
    @order(attribute) for attribute in attributes
    
  desc: (attributes...) ->
    @order(attribute, "desc") for attribute in attributes
    
  allIn: (attributes) ->
    @_whereOperator "$all", attributes
    
  anyIn: (attributes) ->
    @_whereOperator "$any", attributes
    
  notIn: (attributes) ->
    @_whereOperator "$nin", attributes
    
  offset: (number) ->
    @_offset = number
    #@mergeOptions offset: number
    
  limit: (number) ->
    @_limit = number
    @mergeOptions limit: number
    
  select: ->
    @_fields = Tower.Support.Array.args(arguments)
    
  includes: ->
    @_includes = Tower.Support.Array.args(arguments)
    
  page: (number) ->
    @offset(number)
  
  paginate: (options) ->
    limit   = options.perPage || options.limit
    page    = options.page || 1
    @limit(limit)
    @offset((page - 1) * limit)
  
  clone: ->
    new @constructor(@attributes())
    
  merge: (criteria) ->
    attributes = criteria.attributes()
    @_where = @_where.concat attributes._where if attributes._where.length > 0
    @_order = @_order.concat attributes._order if attributes._order.length > 0
    @_offset = attributes._offset if attributes._offset?
    @_limit = attributes._limit if attributes._limit?
    @_fields = attributes._fields if attributes._fields
    @_offset = attributes._offset if attributes._offset?
    @
    
  options: ->
    options = {}
    options.offset  = @_offset  if @_offset?
    options.limit   = @_limit   if @_limit?
    options.fields  = @_fields  if @_fields
    options.sort    = @_order   if @_order.length > 0
    options
    
  conditions: ->
    result = {}
    
    for conditions in @_where
      Tower.Support.Object.deepMergeWithArrays(result, conditions)
    
    result
    
  attributes: (to = {}) ->
    to._where     = @_where.concat()
    to._order     = @_order.concat()
    to._offset    = @_offset  if @_offset?
    to._limit     = @_limit   if @_limit?
    to._fields    = @_fields  if @_fields
    to._includes  = @_includes if @_includes
    to
  
  toQuery: ->
    conditions: @conditions(), options: @options()
    
  toUpdate: ->
    @toQuery()
    
  toCreate: ->
    attributes  = {}
    options     = {}
    
    for conditions in @_where
      # tags: $in: ["a", "b"]
      # $push: tags: ["c"]
      for key, value of conditions
        if Tower.Store.isKeyword(key)
          for _key, _value of value
            attributes[_key] = _value
        else if Tower.Support.Object.isHash(value) && Tower.Store.hasKeyword(value)
          for _key, _value of value
            attributes[key] = _value
        else
          attributes[key] = value
    
    for key, value of attributes
      delete attributes[key] if value == undefined
    
    attributes: attributes, options: options
    
  mergeOptions: (options) ->
    options
    
  _whereOperator: (operator, attributes) ->
    query = {}
    for key, value of attributes
      query[key] = {}
      query[key][operator] = value
    @where query


Tower.Model.Dirty =
  isDirty: ->
    Tower.Support.Object.isPresent(@changes)
    
  attributeChanged: (name) ->
    change = @changes[name]
    return false unless change
    change[0] != change[1]
    
  attributeChange: (name) ->
    change = @changes[name]
    return undefined unless change
    change[1]
    
  attributeWas: (name) ->
    change = @changes[name]
    return undefined unless change
    change[0]
    
  resetAttribute: (name) ->
    array = @changes[name]
    @set(name, array[0]) if array
    @
    
  toUpdates: ->
    result      = {}
    attributes  = @attributes
    
    for key, array of @changes
      result[key] = attributes[key]
    
    result.updatedAt ||= new Date
    
    result

  _attributeChange: (attribute, value) ->
    array       = @changes[attribute] ||= []
    beforeValue = array[0] ||= @attributes[attribute]
    array[1]    = value
    array       = null if array[0] == array[1]
    
    if array then @changes[attribute] = array else delete @changes[attribute]
    
    beforeValue
    

# @todo
# copied this from acts_as_nested_set, haven't messed with it yet.
Tower.Model.Hierarchical =
  ClassMethods:
    hierarchical: ->
      @field "lft", type: "Integer"
      @field "rgt", type: "Integer"
      @field "parentId", type: "Integer"
      
    root: (callback) ->
      @roots.first(callback)
      
    roots: ->
      @where(parentColumnName: null).order(@quotedLeftColumnName())
      
    leaves: ->
      @where("#{@quotedRightColumnName()} - #{@quotedLeftColumnName()} = 1").order(@quotedLeftColumnName())
  
  isRoot: ->
    !!!@get("parentId")
    
  root: (callback) ->
    @selfAndAncestors.where(parentColumnName: null).first(callback)
    
  selfAndAncestors: ->
    @nestedSetScope().where([
      "#{self.class.quotedTableName}.#{quotedLeftColumnName} <= ? AND #{self.class.quotedTableName}.#{quotedRightColumnName} >= ?", left, right
    ])
  
  ancestors: ->
    @withoutSelf @selfAndAncestors

  selfAndSiblings: ->
    @nestedSetScope().where(parentColumnName: parentId)
  
  siblings: ->
    @withoutSelf @selfAndSiblings()

  leaves: ->
    @descendants().where("#{self.class.quotedTableName}.#{quotedRightColumnName} - #{self.class.quotedTableName}.#{quotedLeftColumnName} = 1")
  
  level: (callback) ->
    if get('parentId') == null then 0 else ancestors().count(callback)
  
  selfAndDescendants: ->
    @nestedSetScope().where([
      "#{self.class.quotedTableName}.#{quotedLeftColumnName} >= ? AND #{self.class.quotedTableName}.#{quotedRightColumnName} <= ?", left, right
    ])
  
  descendants: ->
    @withoutSelf @selfAndDescendants()

  isDescendantOf: (other) ->
    other.left < self.left && self.left < other.right && sameScope?(other)
    
  moveLeft: ->
    @moveToLeftOf @leftSibling()
  
  moveRight: ->
    @moveToRightOf @rightSibling()
  
  moveToLeftOf: (node) ->
    @moveTo node, "left"
  
  moveToRightOf: (node) ->
    @moveTo node, "right"
  
  moveToChildOf: (node) ->
    @moveTo node, "child"
  
  moveToRoot: ->
    @moveTo null, "root"
    
  moveTo: (target, position) ->
    @runCallbacks "move", ->
  
  isOrIsDescendantOf: (other) ->
    other.left <= self.left && self.left < other.right && sameScope?(other)

  isAncestorOf: (other) ->
    self.left < other.left && other.left < self.right && sameScope?(other)

  isOrIsAncestorOf: (other) ->
    self.left <= other.left && other.left < self.right && sameScope?(other)
    
  sameScope: (other) ->
    Array(actsAsNestedSetOptions.scope).all (attr) ->
      self.send(attr) == other.send(attr)
  
  leftSibling: ->
    siblings.where(["#{self.class.quotedTableName}.#{quotedLeftColumnName} < ?", left]).
            order("#{self.class.quotedTableName}.#{quotedLeftColumnName} DESC").last
  
  rightSibling: ->
    siblings.where(["#{self.class.quotedTableName}.#{quotedLeftColumnName} > ?", left]).first


Tower.Model.Inheritance =
  _computeType: ->
    

Tower.Model.Persistence =
  ClassMethods:
    defaultStore: if Tower.client then Tower.Store.Memory else Tower.Store.MongoDB
    
    store: (value) ->
      return @_store if !value && @_store
      
      if typeof value == "function"
        @_store   = new value(name: @collectionName(), type: Tower.namespaced(@name))
      else if typeof value == "object"
        @_store ||= new @defaultStore(name: @collectionName(), type: Tower.namespaced(@name))
        Tower.Support.Object.extend @_store, value
      else if value
        @_store   = value
      
      @_store ||= new @defaultStore(name: @collectionName(), type: Tower.namespaced(@name))
      
      @_store
    
    load: (records) ->
      @store().load(records)
      
  InstanceMethods:
    # Create or update the record.
    # 
    # @example Default save
    #   user.save -> console.log "saved"
    # 
    # @example Save without validating
    #   user.save validate: false, -> console.log "saved"
    save: (options, callback) ->
      throw new Error("Record is read only") if @readOnly
      
      if typeof options == "function"
        callback  = options
        options   = {}
      options ||= {}
      
      unless options.validate == false
        @validate (error) =>
          if error
            callback.call @, null, false if callback
          else
            @_save callback
      else
        @_save callback
        
      @
    
    updateAttributes: (attributes, callback) ->
      @set(attributes)
      @_update(attributes, callback)

    destroy: (callback) ->
      if @isNew()
        callback.call @, null if callback
      else
        @_destroy callback
      @

    delete: (callback) ->
      @destroy(callback)

    isPersisted: ->
      !!(@persistent)# && @attributes.hasOwnProperty("id") && @attributes.id != null && @attributes.id != undefined)

    isNew: ->
      !!!@isPersisted()

    reload: ->

    store: ->
      @constructor.store()

    _save: (callback) ->
      @runCallbacks "save", (block) =>
        complete = @_callback(block, callback)

        if @isNew()
          @_create(complete)
        else
          @_update(@toUpdates(), complete)

    _create: (callback) ->
      @runCallbacks "create", (block) =>
        complete = @_callback(block, callback)
        
        @constructor.create @, instantiate: false, (error) =>
          throw error if error && !callback
          
          unless error
            @changes    = {}
            @persistent = true

          complete.call(@, error)

      @

    _update: (updates, callback) ->
      @runCallbacks "update", (block) =>
        complete = @_callback(block, callback)
        @constructor.update @get("id"), updates, instantiate: false, (error) =>
          throw error if error && !callback

          unless error
            @changes    = {}
            @persistent = true

          complete.call(@, error)

      @

    _destroy: (callback) ->
      @runCallbacks "destroy", (block) =>
        complete = @_callback(block, callback)

        @constructor.destroy @, instantiate: false, (error) =>
          throw error if error && !callback
          
          unless error
            @persistent = false
            @changes    = {}
            delete @attributes.id
          
          complete.call(@, error)

      @
      

# @todo
# https://github.com/technoweenie/coffee-resque
Tower.Model.Queue =
  ClassMethods:
    enqueue: ->
      

class Tower.Model.Relation extends Tower.Class           
  # hasMany "commenters", source: "person", sourceType: "User", foreignKey: "userId", type
  constructor: (owner, name, options = {}, callback) ->
    @[key] = value for key, value of options
    
    @owner            = owner
    @name             = name
    @type             = Tower.namespaced(options.type || Tower.Support.String.camelize(Tower.Support.String.singularize(name)))
    @ownerType        = Tower.namespaced(owner.name)
    @dependent      ||= false
    @counterCache   ||= false
    @cache            = false unless @hasOwnProperty("cache")
    @readOnly         = false unless @hasOwnProperty("readOnly")
    @validate         = false unless @hasOwnProperty("validate")
    @autoSave         = false unless @hasOwnProperty("autoSave")
    @touch            = false unless @hasOwnProperty("touch")
    @inverseOf      ||= undefined
    @polymorphic      = options.hasOwnProperty("as") || !!options.polymorphic
    @default          = false unless @hasOwnProperty("default")
    @singularName       = Tower.Support.String.camelize(owner.name, true)
    @pluralName         = Tower.Support.String.pluralize(owner.name) # collectionName?
    @singularTargetName = Tower.Support.String.singularize(name)
    @pluralTargetName   = Tower.Support.String.pluralize(name)
    @targetType         = @type
    
    # hasMany "posts", foreignKey: "postId", cacheKey: "postIds"
    unless @foreignKey
      if @as
        @foreignKey = "#{@as}Id"
      else
        @foreignKey = "#{@singularName}Id"
      
    @foreignType ||= "#{@as}Type" if @polymorphic
    
    if @cache
      if typeof @cache == "string"
        @cacheKey = @cache
        @cache    = true
      else
        @cacheKey = @singularTargetName + "Ids"
      
      @owner.field @cacheKey, type: "Array", default: []
      
    if @counterCache
      if typeof @counterCache == "string"
        @counterCacheKey  = @counterCache
        @counterCache     = true
      else
        @counterCacheKey  = "#{@singularTargetName}Count"
      
      @owner.field @counterCacheKey, type: "Integer", default: 0
      
    @owner.prototype[name] = ->
      @relation(name)
  
  scoped: (record) ->
    new @constructor.Scope(model: @klass(), owner: record, relation: @)
    
  targetKlass: ->
    Tower.constant(@targetType)
    
  klass: ->
    Tower.constant(@type)
    
  inverse: ->
    return @_inverse if @_inverse
    relations = @targetKlass().relations()
    for name, relation of relations
      # need a way to check if class extends another class in coffeescript...
      return relation if relation.inverseOf == @name
      return relation if relation.targetType == @ownerType
    null
  
  class @Scope extends Tower.Model.Scope
    isConstructable: ->
      !!!@relation.polymorphic
    
    constructor: (options = {}) ->
      super(options)
      @owner        = options.owner
      @relation     = options.relation
      
    clone: ->
      new @constructor(model: @model, criteria: @criteria.clone(), owner: @owner, relation: @relation)
      
    setInverseInstance: (record) ->
      if record && @invertibleFor(record)
        inverse = record.relation(@inverseReflectionFor(record).name)
        inverse.target = owner
    
    invertibleFor: (record) ->
      true
      
    inverse: (record) ->
      
  
require './relation/belongsTo'
require './relation/hasMany'
require './relation/hasOne'


Tower.Model.Relations =
  ClassMethods:
    # One-to-one association, where the id is stored on the associated object.
    # 
    # @example Basic example
    #   class App.User extends Tower.Model
    #     @hasOne "address"
    #
    #   class App.Address extends Tower.Model
    #     @belongsTo "user"
    # 
    #   user    = App.User.create()
    #   address = user.createAddress()
    # 
    # @example Example using all the `hasOne` options
    #   class App.User extends Tower.Model
    #     @hasOne "location", type: "Address", embed: true, as: "addressable"
    #   
    #   class App.Address extends Tower.Model
    #     @belongsTo "addressable", polymorphic: true
    hasOne: (name, options = {}) ->
      @relations()[name]  = new Tower.Model.Relation.HasOne(@, name, options)
    
    # One-to-many association, where the id is stored on the associated object.
    # 
    # @example Basic example
    #   class App.User extends Tower.Model
    #     @hasMany "comments"
    #
    #   class App.Comment extends Tower.Model
    #     @belongsTo "user"
    # 
    #   user    = App.User.create()
    #   comment = user.comments().create()
    # 
    # @example Example using all the `hasMany` options
    #   class App.User extends Tower.Model
    #     @hasMany "comments", as: "commentable", embed: true
    #   
    #   class App.Comment extends Tower.Model
    #     @belongsTo "commentable", polymorphic: true
    #
    # @param [String] name Name of the association
    # @param [Object] options Association options
    # @option options [String] as Polymorphic key, if the associated object's relationship is polymorphic
    # @option options [Boolean] embed If true, the data store will try to embed the data in the record (MongoDB currently)
    hasMany: (name, options = {}) ->
      @relations()[name]  = new Tower.Model.Relation.HasMany(@, name, options)
      
    belongsTo: (name, options) ->
      @relations()[name]  = new Tower.Model.Relation.BelongsTo(@, name, options)
    
    relations: ->
      @_relations ||= {}
      
    relation: (name) ->
      relation = @relations()[name]
      throw new Error("Relation '#{name}' does not exist on '#{@name}'") unless relation
      relation
  
  relation: (name) ->
    @constructor.relation(name).scoped(@)
    
  buildRelation: (name, attributes, callback) ->
    @relation(name).build(attributes, callback)
  
  createRelation: (name, attributes, callback) ->
    @relation(name).create(attributes, callback)
    
  destroyRelations: ->
  

class Tower.Model.Scope extends Tower.Class
  constructor: (options = {}) ->
    @model    = options.model
    @criteria = options.criteria || new Tower.Model.Criteria
    @store    = @model.store()
  
  toQuery: (sortDirection) ->
    @toCriteria(sortDirection).toQuery()
    
  toCriteria: (sortDirection) ->
    criteria = @criteria.clone()
    
    if sortDirection || !criteria._order.length > 0
      sort      = @model.defaultSort()
      criteria[sortDirection || sort.direction](sort.name) if sort
    
    criteria
    
  toCreate: ->
    @toQuery()
    
  toUpdate: ->
    @toQuery()
    
  toDestroy: ->
    
  merge: (scope) ->
    @criteria.merge(scope.criteria)
    
  clone: ->
    new @constructor(model: @model, criteria: @criteria.clone())
    
  _extractArgs: (args, opts = {}) ->
    args            = Tower.Support.Array.args(args)
    callback        = Tower.Support.Array.extractBlock(args)
    last            = args[args.length - 1]
    
    if opts.data && (Tower.Support.Object.isHash(last) || Tower.Support.Object.isArray(last))
      data    = args.pop()

    if Tower.Support.Object.isHash(args[args.length - 1])
      if data
        options = data
        data    = args.pop()
      else      
        if Tower.Support.Object.isBaseObject(args[args.length - 1])
          options     = args.pop()
      
    data      = {} unless opts.data
    data    ||= {}
    criteria        = @criteria.clone()
    options       ||= {}
    
    options.instantiate = true unless options.hasOwnProperty("instantiate")
    
    ids             = _.flatten(args) if opts.ids && args.length > 0
    
    if ids && ids.length > 0
      ids = _.map(ids, (idOrRecord) -> if idOrRecord instanceof Tower.Model then idOrRecord.get("id") else idOrRecord)
      criteria.where id: $in: ids
    
    criteria: criteria, data: data, callback: callback, options: options
    
require './scope/finders'
require './scope/persistence'
require './scope/queries'

Tower.Model.Scope.include Tower.Model.Scope.Finders
Tower.Model.Scope.include Tower.Model.Scope.Persistence
Tower.Model.Scope.include Tower.Model.Scope.Queries
    
for key in Tower.Model.Scope.queryMethods
  do (key) =>
    Tower.Model.Scope::[key] = ->
      clone = @clone()
      clone.criteria[key](arguments...)
      clone


Tower.Model.Scopes =
  ClassMethods:
    scope: (name, scope) ->
      @[name] = if scope instanceof Tower.Model.Scope then scope else @where(scope)
    
    scoped: ->
      scope = new Tower.Model.Scope(model: @)
      scope.where(type: @name) if @baseClass().name != @name
      scope
      
    defaultSort: (object) ->
      @_defaultSort = object if object
      @_defaultSort ||= {name: "createdAt", direction: "desc"}

for key in Tower.Model.Scope.queryMethods
  do (key) ->
    Tower.Model.Scopes.ClassMethods[key] = ->
      @scoped()[key](arguments...)

for key in Tower.Model.Scope.finderMethods
  do (key) ->
    Tower.Model.Scopes.ClassMethods[key] = ->
      @scoped()[key](arguments...)

for key in Tower.Model.Scope.persistenceMethods
  do (key) ->
    Tower.Model.Scopes.ClassMethods[key] = ->
      @scoped()[key](arguments...)


Tower.Model.Serialization =
  ClassMethods:
    fromJSON: (data) ->
      records = JSON.parse(data)
      records = [records] unless records instanceof Array

      for record, i in records
        records[i] = new @(record)

      records
    
    toJSON: (records, options = {}) ->
      result = []
      result.push(record.toJSON()) for record in records
      result
  
  toJSON: (options) ->
    @_serializableHash(options)
  
  clone: ->
    new @constructor(Tower.Support.Object.clone(@attributes))
    
  _serializableHash: (options = {}) ->  
    result = {}
    
    attributeNames = Tower.Support.Object.keys(@attributes)
    
    if only = options.only
      attributeNames = _.union(Tower.Support.Object.toArray(only), attributeNames)
    else if except = options.except
      attributeNames = _.difference(Tower.Support.Object.toArray(except), attributeNames)
    
    for name in attributeNames
      result[name] = @_readAttributeForSerialization(name)
      
    if methods = options.methods
      methodNames = Tower.Support.Object.toArray(methods)
      for name in methods
        result[name] = @[name]()
        
    # TODO: async!
    if includes = options.include
      includes  = Tower.Support.Object.toArray(includes)
      for include in includes
        unless Tower.Support.Object.isHash(include)
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
  

Tower.Model.Sync =  
  sync: ->
    syncAction = @syncAction
    @runCallbacks "sync", =>
      @runCallbacks "#{syncAction}Sync", =>
        @store["#{syncAction}Sync"](@)
    
  updateSyncAction: (action) ->
    @syncAction = switch action # create, update, delete
      # if it was create, and it's never been synced, then we can just remove it from memory and be all cool
      when "delete" then "delete"
        
      when "update"
        switch @syncAction
          when "create" then "create"
          else
            "update"
      else
        switch @syncAction
          when "update" then "delete"
          else
            action
            

Tower.Model.Timestamp =
  ClassMethods:
    timestamps: ->
      @include Tower.Model.Timestamp.CreatedAt
      @include Tower.Model.Timestamp.UpdatedAt
      
      @field "createdAt", type: "Date"
      @field "updatedAt", type: "Date"
      
      @before "create", "setCreatedAt"
      @before "save", "setUpdatedAt"
      
  CreatedAt:
    ClassMethods: {}
    
    setCreatedAt: ->
      @set "createdAt", new Date
  
  UpdatedAt:
    ClassMethods: {}
    
    setUpdatedAt: ->
      @set "updatedAt", new Date


Tower.Model.Validations =
  ClassMethods:
    validates: ->
      attributes = Tower.Support.Array.args(arguments)
      options    = attributes.pop()
      validators = @validators()
      
      for key, value of options
        validators.push Tower.Model.Validator.create(key, value, attributes)
        
    validators: ->
      @_validators ||= []
  
  validate: (callback) ->
    success         = false
    @runCallbacks "validate", (block) =>
      complete        = @_callback(block, callback)
      validators      = @constructor.validators()
      errors          = @errors = {}
      
      iterator        = (validator, next) =>
        validator.validateEach @, errors, next
      
      Tower.async validators, iterator, (error) =>
        success = true unless error || Tower.Support.Object.isPresent(errors)
        complete.call(@, !success)
      
      success
    
    success
  

class Tower.Model.Validator
  @create: (name, value, attributes) ->
    switch name
      when "presence"
        new @Presence(name, value, attributes)
      when "count", "length", "min", "max"
        new @Length(name, value, attributes)
      when "format"
        new @Format(name, value, attributes)
  
  constructor: (name, value, attributes) ->
    @name       = name
    @value      = value
    @attributes = attributes
  
  validateEach: (record, errors, callback) ->
    iterator  = (attribute, next) =>
      @validate record, attribute, errors, (error) =>
        next()
      
    Tower.async @attributes, iterator, (error) =>
      callback.call(@, error) if callback
    
  success: (callback) ->
    callback.call @ if callback
    true
    
  failure: (record, attribute, errors, message, callback) ->
    errors[attribute] ||= []
    errors[attribute].push message
    callback.call @, message if callback
    false
    
require './validator/format'
require './validator/length'
require './validator/presence'
require './validator/uniqueness'


require './controller/caching'
require './controller/events'
require './controller/http'
require './controller/sockets'

Tower.Controller.include Tower.Controller.Caching
Tower.Controller.include Tower.Controller.Events
Tower.Controller.include Tower.Controller.HTTP
Tower.Controller.include Tower.Controller.Sockets

require './controller/renderers'

class Tower.Mailer extends Tower.Class

require './mailer/configuration'
require './mailer/rendering'

Tower.Mailer.include Tower.Mailer.Configuration
Tower.Mailer.include Tower.Mailer.Rendering


Tower.Support.Array =
  extractOptions: (args) ->
    if typeof args[args.length - 1] == "object" then args.pop() else {}
    
  extractBlock: (args) ->
    if typeof args[args.length - 1] == "function" then args.pop() else null
    
  args: (args, index = 0, withCallback = false, withOptions = false) ->
    args = Array.prototype.slice.call(args, index, args.length)
    
    if withCallback && !(args.length >= 2 && typeof(args[args.length - 1]) == "function")
      throw new Error("You must pass a callback to the render method")
      
    args
  
  # Sort objects by one or more attributes.
  # 
  #     cityPrimer = (string) ->
  #       string.toLowerCase()
  #     sortObjects deals, ["city", ["price", "desc"]], city: cityPrimer
  # 
  sortBy: (objects) ->
    sortings  = @args(arguments, 1)
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
Tower.Support.Callbacks =
  ClassMethods:
    before: ->
      @appendCallback "before", arguments...
      
    # @example
    #   class App.User extends Tower.Model
    #     @before "save", "beforeSave"
    #     
    #     beforeSave: (callback) ->
    #       # before
    #       callback.call @
    #       # after
    after: ->
      @appendCallback "after", arguments...
      
    callback: ->
      args = Tower.Support.Array.args(arguments)
      args = ["after"].concat args unless args[0].match(/^(?:before|around|after)$/)
      @appendCallback args...
      
    removeCallback: (action, phase, run) ->
      @
      
    appendCallback: (phase) ->
      args = Tower.Support.Array.args(arguments, 1)
      if typeof args[args.length - 1] != "object"
        method    = args.pop()
      if typeof args[args.length - 1] == "object"
        options   = args.pop()
      method    ||= args.pop()
      options   ||= {}
      
      callbacks   = @callbacks()
      
      for filter in args
        callback = callbacks[filter] ||= new Tower.Support.Callbacks.Chain
        callback.push phase, method, options
        
      @
      
    prependCallback: (action, phase, run, options = {}) ->
      @
      
    callbacks: ->
      @_callbacks ||= {}
      
  runCallbacks: (kind, options, block, complete) ->
    if typeof options == "function"
      complete  = block
      block     = options
      options   = {}
    options   ||= {}
    
    chain = @constructor.callbacks()[kind]
    if chain
      chain.run(@, options, block, complete)
    else
      block.call @
      complete.call @ if complete
      
  _callback: (callbacks...) ->
    (error) =>
      for callback in callbacks
        callback.call(@, error) if callback
      
class Tower.Support.Callbacks.Chain
  constructor: (options = {}) ->
    @[key] = value for key, value of options

    @before ||= []
    @after  ||= []

  run: (binding, options, block, complete) ->
    runner    = (callback, next) =>
      callback.run(binding, options, next)
    
    Tower.async @before, runner, (error) =>
      unless error
        if block
          switch block.length
            when 0
              block.call(binding)
              Tower.async @after, runner, (error) =>
                complete.call binding if complete
                binding
            else
              block.call binding, (error) =>
                unless error
                  Tower.async @after, runner, (error) =>
                    complete.call binding if complete
                    binding
        else
          Tower.async @after, runner, (error) =>
            complete.call binding if complete
            binding
    
  push: (phase, method, filters, options) ->
    @[phase].push new Tower.Support.Callback(method, filters, options)
    
class Tower.Support.Callback
  constructor: (method, conditions = {}) ->
    @method       = method
    @conditions   = conditions
    
    conditions.only   = Tower.Support.Object.toArray(conditions.only) if conditions.hasOwnProperty("only")
    conditions.except = Tower.Support.Object.toArray(conditions.except) if conditions.hasOwnProperty("except")
    
  run: (binding, options, next) ->
    conditions  = @conditions
    
    if options && options.hasOwnProperty("name")
      if conditions.hasOwnProperty("only")
        return next() if _.indexOf(conditions.only, options.name) == -1
      else if conditions.hasOwnProperty("except")
        return next() if _.indexOf(conditions.except, options.name) != -1
        
    method      = @method
    method      = binding[method] if typeof method == "string"
    
    switch method.length
      when 0
        result = method.call binding
        next(if !result then new Error("Callback did not pass") else null)
      else
        method.call binding, next


specialProperties = ['included', 'extended', 'prototype', 'ClassMethods', 'InstanceMethods']

class Tower.Class
  @global: (value) ->
    @_global = value unless value == undefined
    @_global = true if @_global == undefined
    
    if value == true
      global[@name] = @
    else if value == false
      delete global[@name]
    
    @_global
    
  @alias: (to, from) ->
    Tower.Support.Object.alias(@::, to, from)
  
  @accessor: (key, callback) ->
    Tower.Support.Object.accessor(@::, key, callback)
    @
  
  @getter: (key, callback) ->
    Tower.Support.Object.getter(@::, key, callback)
    @
  
  @setter: (key) ->
    Tower.Support.Object.setter(@::, key)
    @
    
  @classAlias: (to, from) ->
    Tower.Support.Object.alias(@, to, from)
    @
    
  @classAccessor: (key, callback) ->
    Tower.Support.Object.accessor(@, key, callback)
    @
    
  @classGetter: (key, callback) ->
    Tower.Support.Object.getter(@, key, callback)
    @
  
  @classSetter: (key) ->
    Tower.Support.Object.setter(@, key)
    @

  @classEval: (block) ->
    block.call(@)

  @delegate: (key, options = {}) ->
    Tower.Support.Object.delegate(@::, key, options)
    @
  
  @mixin: (self, object) ->
    for key, value of object when key not in specialProperties
      self[key] = value
    
    object
  
  @extend: (object) ->
    @mixin(@, object)
    
    extended = object.extended
    extended.apply(object) if extended
    
    object
    
  @self: (object) ->
    @extend object
  
  @include: (object) ->
    @extend(object.ClassMethods) if object.hasOwnProperty("ClassMethods")
    @include(object.InstanceMethods) if object.hasOwnProperty("InstanceMethods")
    
    @mixin(@::, object)
    
    included = object.included
    included.apply(object) if included
    
    object
    
  @className: ->
    Tower.Support.Object.functionName(@)
  
  className: ->
    @constructor.className()
  
  constructor: ->
    @initialize()
    
  initialize: ->
    

Tower.Support.EventEmitter =
  #included: ->
  #  @events = {}
  
  isEventEmitter: true
  
  events: ->
    @_events ||= {}
  
  hasEventListener: (key) ->
    Tower.Support.Object.isPresent(@events(), key)
    
  event: (key) ->
    @events()[key] ||= new Tower.Event(@, key)
  
  # Examples:
  # 
  #     @on "click .item a", "clickItem"
  #     @on "click", "clickItem", target: ".item a"
  # 
  # Use jQuery to set relavant parent/child elements using jQuery `find`, `parents`, `closest`, etc.
  # 
  #     @on "click", "clickItem", selector: ".item a", find: {meta: "span small"}, closest: {title: ".item h1"}
  #     #=> @titleElement = @targetElement.closest(".item h1")
  on: ->
    args = Tower.Support.Array.args(arguments)
    
    if typeof args[args.length - 1] == "object"
      options = args.pop()
      if args.length == 0
        eventMap  = options
        options   = {}
    else
      options = {}
      
    if typeof args[args.length - 1] == "object"
      eventMap = args.pop()
    else
      eventMap = {}
      eventMap[args.shift()] = args.shift()
    
    # this is essentially what I'm doing above  
    #switch args.length
    #  # @on click: "clickHandler", keypress: "keypressHandler"
    #  when 1
    #  # @on "click", "clickHandler"
    #  # @on "click", -> alert '!'
    #  # @on {click: "clickHandler", keypress: "keypressHandler"}, {type: "socket"}
    #  when 2
    #  # @on "click", "clickHandler", type: "socket"
    #  when 3
    
    for eventType, handler of eventMap
      @addEventHandler(eventType, handler, options)
        
  addEventHandler: (type, handler, options) ->
    @event(type).addHandler(handler)
  
  mutation: (wrappedFunction) ->
    ->
      result = wrappedFunction.apply(this, arguments)
      @event('change').fire(this, this)
      result
      
  prevent: (key) ->
    @event(key).prevent()
    @
    
  allow: (key) ->
    @event(key).allow()
    @
    
  isPrevented: (key) ->
    @event(key).isPrevented()
    
  fire: (key) ->
    event = @event(key)
    event.fire.call event, Tower.Support.Array.args(arguments, 1)
    
  allowAndFire: (key) ->
    @event(key).allowAndFire(Tower.Support.Array.args(arguments, 1))


Tower.Support.I18n =
  PATTERN: /(?:%%|%\{(\w+)\}|%<(\w+)>(.*?\d*\.?\d*[bBdiouxXeEfgGcps]))/g  
  defaultLanguage: "en"
  
  load: (pathOrObject, language = @defaultLanguage) ->
    store     = @store()
    language  = store[language] ||= {}
    Tower.Support.Object.deepMerge(language, if typeof(pathOrObject) == "string" then require(pathOrObject) else pathOrObject)
    @
  
  translate: (key, options = {}) ->
    if options.hasOwnProperty("tense")
      key += ".#{options.tense}"
    if options.hasOwnProperty("count")
      switch options.count
        when 0 then key += ".none"
        when 1 then key += ".one"
        else key += ".other"
    
    @interpolate(@lookup(key, options.language), options)
    
  localize: ->
    @translate arguments...
  
  lookup: (key, language = @defaultLanguage) ->
    parts   = key.split(".")
    result  = @store()[language]
    
    try
      for part in parts
        result = result[part]
    catch error
      result = null
      
    throw new Error("Translation doesn't exist for '#{key}'") unless result?
    
    result
    
  store: ->
    @_store ||= {}
  
  # https://github.com/svenfuchs/i18n/blob/master/lib/i18n/interpolate/ruby.rb
  interpolate: (string, locals = {}) ->
    string.replace @PATTERN, (match, $1, $2, $3) ->
      if match == '%%'
        '%'
      else
        key = $1 || $2
        if locals.hasOwnProperty(key)
          value = locals[key]
        else
          throw new Error("Missing interpolation argument #{key}")
        value = value.call(locals) if typeof value == 'function'
        if $3 then sprintf("%#{$3}", value) else value
    
Tower.Support.I18n.t = Tower.Support.I18n.translate


Tower.Support.Number =    
  isInt: (n) ->
    n == +n && n == (n|0)
  
  isFloat: (n) ->
    n == +n && n != (n|0)


specialProperties = ['included', 'extended', 'prototype', 'ClassMethods', 'InstanceMethods']

Tower.Support.Object =
  extend: (object) ->
    args = Tower.Support.Array.args(arguments, 1)
    
    for node in args
      for key, value of node when key not in specialProperties
        object[key] = value
    
    object
    
  cloneHash: (options) ->
    result = {}
    
    for key, value of options
      if @isArray(value)
        result[key] = @cloneArray(value)
      else if @isHash(value)
        result[key] = @cloneHash(value)
      else
        result[key] = value
        
    result
  
  cloneArray: (value) ->
    result = value.concat()
    
    for item, i in result
      if @isArray(item)
        result[i] = @cloneArray(item)
      else if @isHash(item)
        result[i] = @cloneHash(item)
        
    result
    
  deepMerge: (object) ->
    args = Tower.Support.Array.args(arguments, 1)
    for node in args
      for key, value of node when key not in specialProperties
        if object[key] && typeof value == 'object'
          object[key] = Tower.Support.Object.deepMerge(object[key], value)
        else
          object[key] = value
    object
    
  deepMergeWithArrays: (object) ->
    args = Tower.Support.Array.args(arguments, 1)
    
    for node in args
      for key, value of node when key not in specialProperties
        oldValue = object[key]
        if oldValue
          if @isArray(oldValue)
            object[key] = oldValue.concat value
          else if typeof oldValue == "object" && typeof value == "object"
            object[key] = Tower.Support.Object.deepMergeWithArrays(object[key], value)
          else
            object[key] = value
        else
          object[key] = value
          
    object
  
  defineProperty: (object, key, options = {}) ->
    Object.defineProperty object, key, options
  
  functionName: (fn) ->
    return fn.__name__ if fn.__name__
    return fn.name if fn.name
    fn.toString().match(/\W*function\s+([\w\$]+)\(/)?[1]
  
  alias: (object, to, from) ->
    object[to] = object[from]
  
  accessor: (object, key, callback) ->
    object._accessors ||= []
    object._accessors.push(key)
    @getter(key, object, callback)
    @setter(key, object)
    
    @

  setter: (object, key) ->
    unless object.hasOwnProperty("_setAttribute")
      @defineProperty object, "_setAttribute", 
        enumerable: false, 
        configurable: true, 
        value: (key, value) -> 
          @["_#{key}"] = value
    
    object._setters ||= []
    object._setters.push(key)
    
    @defineProperty object, key, 
      enumerable: true, 
      configurable: true, 
      set: (value) -> 
        @["_setAttribute"](key, value)
        
    @
        
  getter: (object, key, callback) ->
    unless object.hasOwnProperty("_getAttribute")
      @defineProperty object, "_getAttribute", 
        enumerable: false, 
        configurable: true, 
        value: (key) -> 
          @["_#{key}"]
      
    object._getters ||= []
    object._getters.push(key)
    
    @defineProperty object, key, 
      enumerable: true, 
      configurable: true,
      get: ->
        @["_getAttribute"](key) || (@["_#{key}"] = callback.apply(@) if callback)
        
    @
    
  variables: (object) ->
  
  accessors: (object) ->
  
  methods: (object) ->
    result = []
    for key, value of object
      result.push(key) if @isFunction(value)
    result
  
  delegate: (object, keys..., options = {}) ->
    to          = options.to
    isFunction  = @isFunction(object)
    
    for key in keys
      if isFunction
        object[key] = ->
          @[to]()[key](arguments...)
      else
        @defineProperty object, key, 
          enumerable: true, 
          configurable: true, 
          get: -> @[to]()[key]
    
    object
    
  isFunction: (object) ->
    !!(object && object.constructor && object.call && object.apply)
    
  toArray: (object) ->
    if @isArray(object) then object else [object]
  
  keys: (object) ->
    Object.keys(object)
  
  isA: (object, isa) ->
    
  isRegExp: (object) ->
    !!(object && object.test && object.exec && (object.ignoreCase || object.ignoreCase == false))
    
  isHash: (object) ->
    @isObject(object) && !(@isFunction(object) || @isArray(object) || _.isDate(object) || _.isRegExp(object))
    
  isBaseObject: (object) ->
    object && object.constructor && object.constructor.name == "Object"
    
  isArray: Array.isArray || (object) ->
    toString.call(object) == '[object Array]'
  
  kind: (object) ->
    type = typeof(object)
    switch type
      when "object"
        return "array"      if _.isArray(object)
        return "arguments"  if _.isArguments(object)
        return "boolean"    if _.isBoolean(object)
        return "date"       if _.isDate(object)
        return "regex"      if _.isRegExp(object)
        return "NaN"        if _.isNaN(object)
        return "null"       if _.isNull(object)
        return "undefined"  if _.isUndefined(object)
        return "object"
      when "number"
        return "integer"    if object == +object && object == (object|0)
        return "float"      if object == +object && object != (object|0)
        return "number"
      when "function"
        return "regex"      if _.isRegExp(object)
        return "function"
      else
        return type
    
  isObject: (object) ->
    return object == Object(object)
  
  isPresent: (object) ->
    !@isBlank(object)
  
  isBlank: (object) ->
    return (object == "") if typeof object == "string"
    return false for key, value of object
    return true
    
  has: (object, key) ->
    object.hasOwnProperty(key)
    

Tower.Support.RegExp =
  regexpEscape: (string) ->
    string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    

Tower.Support.String =
  camelize_rx:    /(?:^|_|\-)(.)/g
  capitalize_rx:  /(^|\s)([a-z])/g
  underscore_rx1: /([A-Z]+)([A-Z][a-z])/g
  underscore_rx2: /([a-z\d])([A-Z])/g
  
  parameterize: (string) ->
    Tower.Support.String.underscore(string).replace("_", "-")
  
  constantize: (string, scope = global) ->
    scope[@camelize(string)]
  
  camelize: (string, firstLetterLower) ->
    string = string.replace @camelize_rx, (str, p1) -> p1.toUpperCase()
    if firstLetterLower then string.substr(0,1).toLowerCase() + string.substr(1) else string

  underscore: (string) ->
    string.replace(@underscore_rx1, '$1_$2')
          .replace(@underscore_rx2, '$1_$2')
          .replace('-', '_').toLowerCase()

  singularize: (string) ->
    len = string.length
    if string.substr(len - 3) is 'ies'
      string.substr(0, len - 3) + 'y'
    else if string.substr(len - 1) is 's'
      string.substr(0, len - 1)
    else
      string

  pluralize: (count, string) ->
    if string
      return string if count is 1
    else
      string = count

    len = string.length
    lastLetter = string.substr(len - 1)
    if lastLetter is 'y'
      "#{string.substr(0, len - 1)}ies"
    else if lastLetter is 's'
      string
    else
      "#{string}s"

  capitalize: (string) -> string.replace @capitalize_rx, (m,p1,p2) -> p1 + p2.toUpperCase()
  
  trim: (string) -> if string then string.trim() else ""
  
  interpolate: (stringOrObject, keys) ->
    if typeof stringOrObject is 'object'
      string = stringOrObject[keys.count]
      unless string
        string = stringOrObject['other']
    else
      string = stringOrObject

    for key, value of keys
      string = string.replace(new RegExp("%\\{#{key}\\}", "g"), value)
    string
    
# use single quotes, otherwise they're escaped
Tower.Support.String.toQueryValue = (value, negate = "") ->
  if Tower.Support.Object.isArray(value)
    items = []
    for item in value
      result  = negate
      result += item
      items.push result
    result = items.join(",")
  else
    result    = negate
    result   += value.toString()
  
  result = result.replace(" ", "+").replace /[#%\"\|<>]/g, (_) -> encodeURIComponent(_)
  result

# toQuery likes: 10
# toQuery likes: ">=": 10
# toQuery likes: ">=": 10, "<=": 20
# toQuery tags: ["ruby", "javascript"]
# toQuery tags: "!=": ["java", ".net"]
#   #=> tags=-java,-ruby
# toQuery tags: "!=": ["java", ".net"], "==": ["ruby", "javascript"]
#   #=> tags=ruby,javascript,-java,-ruby
Tower.Support.String.toQuery = (object, schema = {}) ->
  result = []
  
  for key, value of object
    param   = "#{key}="
    type    = schema[key] || "string"
    negate  = if type == "string" then "-" else "^"
    if Tower.Support.Object.isHash(value)
      data          = {}
      data.min      = value[">="] if value.hasOwnProperty(">=")
      data.min      = value[">"]  if value.hasOwnProperty(">")
      data.max      = value["<="] if value.hasOwnProperty("<=")
      data.max      = value["<"]  if value.hasOwnProperty("<")
      data.match    = value["=~"] if value.hasOwnProperty("=~")
      data.notMatch = value["!~"] if value.hasOwnProperty("!~")
      data.eq       = value["=="] if value.hasOwnProperty("==")
      data.neq      = value["!="] if value.hasOwnProperty("!=")
      data.range    = data.hasOwnProperty("min") || data.hasOwnProperty("max")
      
      set = []
  
      if data.range && !(data.hasOwnProperty("eq") || data.hasOwnProperty("match"))
        range = ""
        
        if data.hasOwnProperty("min")
          range += Tower.Support.String.toQueryValue(data.min)
        else
          range += "n"
        
        range += ".."
        
        if data.hasOwnProperty("max")
          range += Tower.Support.String.toQueryValue(data.max)
        else
          range += "n"
        
        set.push range
      
      if data.hasOwnProperty("eq")
        set.push Tower.Support.String.toQueryValue(data.eq)
      if data.hasOwnProperty("match")
        set.push Tower.Support.String.toQueryValue(data.match)
      if data.hasOwnProperty("neq")
        set.push Tower.Support.String.toQueryValue(data.neq, negate)
      if data.hasOwnProperty("notMatch")
        set.push Tower.Support.String.toQueryValue(data.notMatch, negate)
      
      param += set.join(",")
    else
      param += Tower.Support.String.toQueryValue(value)
    
    result.push param
  
  result.sort().join("&")
  
Tower.Support.String.extractDomain = (host, tldLength = 1) ->
  return null unless @namedHost(host)
  parts = host.split('.')
  parts[0..parts.length - 1 - 1 + tldLength].join(".")

Tower.Support.String.extractSubdomains = (host, tldLength = 1) ->
  return [] unless @namedHost(host)
  parts = host.split('.')
  parts[0..-(tldLength+2)]
  
Tower.Support.String.extractSubdomain = (host, tldLength = 1) ->
  @extractSubdomains(host, tldLength).join('.')

Tower.Support.String.namedHost = (host) ->
  !!!(host == null || /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.exec(host))
  
Tower.Support.String.rewriteAuthentication = (options) ->
  if options.user && options.password
    "#{encodeURI(options.user)}:#{encodeURI(options.password)}@"
  else
    ""

Tower.Support.String.hostOrSubdomainAndDomain = (options) ->
  return options.host if options.subdomain == null && options.domain == null
  
  tldLength = options.tldLength || 1
  
  host = ""
  unless options.subdomain == false
    subdomain = options.subdomain || @extractSubdomain(options.host, tldLength)
    host += "#{subdomain}." if subdomain
    
  host += (options.domain || @extractDomain(options.host, tldLength))
  host

# urlFor controller: "posts", action: "index"
# urlFor @user
# urlFor User
# urlFor "admin", @user
# Tower._urlFor({onlyPath: true, params: {likes: {">=": -10, "<=": 20, "!=": [13, 15]}, tags: {"==": ["ruby", /javascript /i], "!=": ["java"]}}, trailingSlash: false}, {likes: "integer"})
# "?likes=-10..20,^13,^15&tags=ruby,/javascript+/i,-java"
Tower.Support.String.urlFor = (options) ->
  unless options.host || options.onlyPath
    throw new Error('Missing host to link to! Please provide the :host parameter, set defaultUrlOptions[:host], or set :onlyPath to true')

  result  = ""  
  params  = options.params || {}
  path    = (options.path || "").replace(/\/+/, "/")
  schema  = options.schema || {}
  
  delete options.path
  delete options.schema
  
  unless options.onlyPath
    port  = options.port
    delete options.port
    
    unless options.protocol == false
      result += options.protocol || "http"
      result += ":" unless result.match(Tower.Support.RegExp.regexpEscape(":|//"))
    
    result += "//" unless result.match("//")
    result += @rewriteAuthentication(options)
    result += @hostOrSubdomainAndDomain(options)
    
    result += ":#{port}" if port
    
  # params.reject! {|k,v| v.toParam.nil? }
  
  if options.trailingSlash
    result += path.replace /\/$/, "/"
  else
    result += path
    
  result += "?#{Tower.Support.String.toQuery(params, schema)}" unless Tower.Support.Object.isBlank(params)
  result += "##{Tower.Support.String.toQuery(options.anchor)}" if options.anchor
  result

# Tower.urlFor(RW.MongoUser.first(), {onlyPath: false, params: {likes: {">=": -10, "<=": 20, "!=": [13, 15]}, tags: {"==": ["ruby", /javascript#/i], "!=": ["java"]}}, trailingSlash: true, host: "rituwall.com", user: "lance", password: "pollard", anchor: {likes: 10}})
# "http://lance:pollard@rituwall.com/mongo-users/1?likes=-10..20,-13,-15&tags=ruby,/javascript%23/i,-java#likes=10"
Tower.urlFor = ->
  args = Tower.Support.Array.args(arguments)
  return null unless args[0]
  if args[0] instanceof Tower.Model || (typeof(args[0])).match(/(string|function)/)
    last = args[args.length - 1]
    if last instanceof Tower.Model || (typeof(last)).match(/(string|function)/)
      options = {}
    else
      options = args.pop()
      
  options ||= args.pop()
  
  result    = ""
  
  if options.controller && options.action
    route   = Tower.Route.find(name: Tower.Support.String.camelize(options.controller).replace(/(Controller)?$/, "Controller"), action: options.action)
    if route
      result  = "/" + Tower.Support.String.parameterize(options.controller)
  else
    for item in args
      result += "/"
      if typeof(item) == "string"
        result += item
      else if item instanceof Tower.Model
        result += item.toPath()
      else if typeof(item) == "function" # need better, b/c i'm meaning constructor here
        result += item.toParam()
  
  result += switch options.action
    when "new" then "/new"
    when "edit" then "/edit"
    else
      ""
  
  options.onlyPath = true unless options.hasOwnProperty("onlyPath")
  options.path = result
  
  Tower.Support.String.urlFor(options)
  
Tower.Support.String.parameterize = (string) ->
  Tower.Support.String.underscore(string).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "-").replace(/^-+|-+$/g, '')
Tower.Support.Url = {}
  

class Tower.View.Component
  @render: ->
    args              = Tower.Support.Array.args(arguments)
    template          = args.shift()
    block             = Tower.Support.Array.extractBlock(args)
    unless args[args.length - 1] instanceof Tower.Model || typeof(args[args.length - 1]) != "object"
      options         = args.pop()
    options         ||= {}
    options.template  = template
    (new @(args, options)).render(block)
    
  constructor: (args, options) ->
    @[key] = value for key, value of options
    
  tag: (key, args...) ->
    @template.tag key, args
    
  addClass: (string, args) ->
    result = if string then string.split(/\s+/g) else []
    for arg in args
      continue unless arg
      result.push(arg) unless result.indexOf(arg) > -1
    result.join(" ")
class Tower.View.Form extends Tower.View.Component
  constructor: (args, options) ->
    super
    @model      = args.shift() || new Tower.Model
    
    if typeof @model == "string"
      klass     = Tower.constant(Tower.Support.String.camelize(@model))
      @model    = if klass then new klass else null
    
    @attributes = @_extractAttributes(options)
  
  render: (callback) ->
    @tag "form", @attributes, =>
      @tag "input", type: "hidden", name: "_method", value: @attributes["data-method"]
      if callback
        builder    = new Tower.View.Form.Builder([], 
          template:   @template
          tabindex:   1
          accessKeys: {}
          model:      @model
        )
        builder.render(callback)
  
  _extractAttributes: (options = {}) ->
    attributes                  = options.html || {}
    attributes.action           = options.url || Tower.urlFor(@model)
    attributes.class            = options["class"] if options.hasOwnProperty("class")
    #@mergeClass attributes, config.formClass
    attributes.id               = options.id if options.hasOwnProperty("id")
    attributes.id             ||= Tower.Support.String.parameterize("#{@model.constructor.name}-form")
    attributes.enctype          = "multipart/form-data" if (options.multipart || attributes.multipart == true)
    attributes.role             = "form"
    attributes.novalidate       = "true" # needs to be true b/c the error popups are horribly ugly!# if options.validate == false
    attributes["data-validate"] = options.validate.toString() if options.hasOwnProperty("validate")
    
    method                      = attributes.method || options.method
    
    if !method || method == ""
      if @model && @model.get("id")
        method                 = "put"
      else
        method                 = "post"
    
    attributes["data-method"] = method
    attributes.method        = if method == "get" then "get" else "post" 
    
    attributes
    
require './form/builder'
require './form/field'
require './form/fieldset'


Tower.View.Helpers =
  titleTag: (title) ->
    "<title>#{title}</title>"
  
  metaTag: (name, content) ->
    """<meta name="#{name}" content="#{content}"/>"""
  
  tag: (name, options) ->
    
  linkTag: (title, path, options) ->
    
  imageTag: (path, options) ->
    
  csrfMetaTag: ->
    @metaTag("csrf-token", @request.session._csrf)
  
  contentTypeTag: (type = "UTF-8") ->
    "<meta charset=\"#{type}\" />"
    
  javascriptTag: (path) ->
    "<script type=\"text/javascript\" src=\"#{path}\" ></script>"

  stylesheetTag: (path) ->
    "<link href=\"#{path}\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\"/>"
    
  mobileTags: ->
    """
    <meta content='yes' name='apple-mobile-web-app-capable'>
    <meta content='yes' name='apple-touch-fullscreen'>
    <meta content='initial-scale = 1.0, maximum-scale = 1.0, user-scalable = no, width = device-width' name='viewport'>
    """
    

Tower.View.Rendering =
  render: (options, callback) ->
    options.type        ||= @constructor.engine
    options.layout      = @_context.layout() if !options.hasOwnProperty("layout") && @_context.layout
    options.locals      = @_renderingContext(options)
    
    @_renderBody options, (error, body) =>
      return callback(error, body) if error
      @_renderLayout(body, options, callback)
  
  partial: (path, options, callback) ->
    if typeof options == "function"
      callback  = options
      options   = {}
    options ||= {}
    prefixes = options.prefixes
    prefixes ||= [@_context.collectionName] if @_context
    template = @_readTemplate(path, prefixes, options.type || Tower.View.engine)
    @_renderString(template, options, callback)
    
  _renderBody: (options, callback) ->
    if options.text
      callback(null, options.text)
    else if options.json
      callback(null, if typeof(options.json) == "string" then options.json else JSON.stringify(options.json))
    else
      unless options.inline
        options.template = @_readTemplate(options.template, options.prefixes, options.type)
      @_renderString(options.template, options, callback)
  
  _renderLayout: (body, options, callback) ->
    if options.layout
      layout  = @_readTemplate("layouts/#{options.layout}", [], options.type)
      options.locals.body = body
      @_renderString(layout, options, callback)
    else
      callback(null, body)
      
  _renderString: (string, options = {}, callback) ->
    if !!options.type.match(/coffee/)
      e       = null
      result  = null
      # tmp hack
      coffeekup = if Tower.client then global.CoffeeKup else require("coffeekup")
      try
        locals          = options.locals
        locals.renderWithEngine = @renderWithEngine
        locals._readTemplate = @_readTemplate
        locals.cache    = Tower.env != "development"
        locals.format   = true
        hardcode        = {}
        for helper in Tower.View.helpers
          hardcode      = _.extend(hardcode, helper)
        hardcode        = _.extend(hardcode, tags: coffeekup.tags)
        locals.hardcode = hardcode
        locals._ = _
        result = coffeekup.render string, locals
      catch error
        e = error
      
      callback e, result
    else if options.type
      mint = require "mint"
      engine = require("mint").engine(options.type)
      mint[engine](string, options.locals, callback)
    else
      mint = require "mint"
      engine = require("mint")
      options.locals.string = string
      engine.render(options.locals, callback)
  
  _renderingContext: (options) ->
    locals  = this
    _ref    = @_context
    for key of _ref
      value = _ref[key]
      locals[key] = value  unless key.match(/^(constructor|head)/)
    #newlocals = {}
    #newlocals.locals = locals
    #locals = newlocals
    locals = Tower.Support.Object.extend(locals, options.locals)
    locals.pretty = true  if @constructor.prettyPrint
    locals
    
  _readTemplate: (template, prefixes, ext) ->
    return template unless typeof template == "string"
    # tmp
    result = @constructor.cache["app/views/#{template}"] ||= @constructor.store().find(path: template, ext: ext, prefixes: prefixes)
    throw new Error("Template '#{template}' was not found.") unless result
    result
    
  renderWithEngine: (template, engine) ->
    if Tower.client
      "(#{template}).call(this);"
    else
      mint = require("mint")
      mint[mint.engine(engine || "coffee")] template, {}, (error, result) ->
        console.log error if error
  

class Tower.View.Table extends Tower.View.Component
  constructor: (args, options) ->
    super
    
    recordOrKey       = args.shift()
    @key              = @recordKey(recordOrKey)
    @rowIndex         = 0
    @cellIndex        = 0
    @scope            = "table"
    @headers          = []
    
    options.summary ||= "Table for #{_.titleize(@key)}"
    #options.class     = ["data-table", options.class].compact.uniq.join(" ")
    options.role      = "grid"
    options.class     = @addClass(options.class || "", ["table"])
    
    data              = options.data ||= {}
    
    #data.url        = options.url || @template.controller.request.path
    #data.for        = options.for || options.model || @key
    data.total        = options.total if options.hasOwnProperty("total")
    data.page         = options.page  if options.hasOwnProperty("page")
    data.count        = options.count if options.hasOwnProperty("count")
    
    aria              = options.aria || {}
    delete options.aria
    
    aria["aria-multiselectable"] = false unless aria.hasOwnProperty("aria-multiselectable") || options.multiselect == true
    
    options.id      ||= "#{recordOrKey}-table"
    
    @options =
      summary:  options.summary
      role:     options.role
      data:     options.data
      class:    options.class
   
  render: (block) ->
    @tag "table", @options, =>
      block(@) if block
      null
      
  tableQueryRowClass: ->
    ["search-row", if queryParams.except("page", "sort").blank? then null else "search-results"].compact.join(" ")
 
  linkToSort: (title, attribute, options = {}) ->
    sortParam = sortValue(attribute, oppositeSortDirection(attribute))
    linkTo title, withParams(request.path, sort: sortParam), options
 
  nextPagePath: (collection) ->
    withParams(request.path, page: collection.nextPage)
 
  prevPagePath: (collection) ->
    withParams(request.path, page: collection.prevPage)
 
  firstPagePath: (collection) ->
    withParams(request.path, page: 1)
 
  lastPagePath: (collection) ->
    withParams(request.path, page: collection.lastPage)
 
  currentPageNum: ->
    page = if params.page then params.page else 1
    page = 1 if page < 1
    page
 
  caption: ->
    
  # scope='col'
  head: (attributes = {}, block) ->
    @hideHeader = attributes.visible == false
    delete attributes.visible
    
    @_section "head", attributes, block
    
  # scope='row'
  # <td headers='x'/>
  body: (attributes = {}, block) ->
    @_section "body", attributes, block
    
  foot: (attributes = {}, block) ->
    @_section "foot", attributes, block
    
  _section: (scope, attributes, block) ->
    @rowIndex   = 0
    @scope      = scope
    
    @tag "t#{scope}", attributes, block
    
    @rowIndex   = 0
    @scope      = "table"
    
  row: (args..., block) ->
    attributes = Tower.Support.Array.extractOptions(args)
    
    attributes.scope = "row"
    
    if @scope == "body"
      #attributes.class = [template.cycle("odd", "even"), attributes.class].compact.uniq.join(" ")
      attributes.role = "row"
    
    @rowIndex += 1
    @cellIndex = 0
    
    @tag "tr", attributes, block
    
    @cellIndex = 0
    
  column: (args..., block) ->
    attributes        = Tower.Support.Array.extractOptions(args)
    value             = args.shift()
    
    attributes.id   ||= @idFor("header", key, value, @rowIndex, @cellIndex) if Tower.View.idEnabledOn.include?("table")
    
    attributes.width  = @pixelate(attributes.width) if attributes.hasOwnProperty("width")
    attributes.height = @pixelate(attributes.height) if attributes.hasOwnProperty("height")
    
    @headers.push attributes.id
    
    tag "col", attributes
    
    @cellIndex += 1
    
  # direction => "ascending"
  # valid directions: ascending, descending, none, other
  # abbr is what the header controls (for sorting)
  header: ->
    args              = Tower.Support.Array.args(arguments)
    block             = Tower.Support.Array.extractBlock(args)
    attributes        = Tower.Support.Array.extractOptions(args)
    value             = args.shift()
    
    attributes.abbr ||= value
    attributes.role   = "columnheader"
    attributes.id   ||= @idFor("header", key, value, @rowIndex, @cellIndex) if Tower.View.idEnabledOn.include?("table")
    attributes.scope = "col"
    attributes.abbr ||= attributes.for if attributes.hasOwnProperty("for")
    attributes.abbr ||= value
    
    delete attributes.for
    
    attributes.width  = @pixelate(attributes.width) if attributes.hasOwnProperty("width")
    attributes.height = @pixelate(attributes.height) if attributes.hasOwnProperty("height")
    
    sort = attributes.sort == true
    delete attributes.sort
    
    if sort
      attributes.class        = @addClass attributes.class || "", [attributes.sortClass || "sortable"]
      attributes.direction  ||= "asc"#@template.sortClass(value)
    
    delete attributes.sortClass
    
    label = attributes.label || _.titleize(value.toString())
    delete attributes.label
   
    direction = attributes.direction
    delete attributes.direction
    
    if direction
      attributes["aria-sort"] = direction
      attributes.class = [attributes.class, direction].join(" ")
      attributes["aria-selected"] = true
    else
      attributes["aria-sort"] = "none"
      attributes["aria-selected"] = false
    
    @headers.push(attributes.id)
    
    if block
      @tag "th", attributes, block
    else
      if sort
        @tag "th", attributes, =>
          @linkToSort(label, value)
      else
        @tag "th", attributes, =>
          @tag "span", label
    
    @cellIndex += 1
  
  linkToSort: (label, value) ->
    direction = "+"
    @tag "a", href: "?sort=#{direction}", =>
      @tag "span", label
    
  cell: (args..., block) ->
    attributes        = Tower.Support.Array.extractOptions(args)
    value             = args.shift()
    
    attributes.role   = "gridcell"
    attributes.id   ||= @idFor("cell", key, value, @rowIndex, @cellIndex) if Tower.View.idEnabledOn.include?("table")
    
    #attributes[:"aria-describedby"] = @headers[@cellIndex]
    attributes.headers            = @headers[@cellIndex]
    
    attributes.width  = @pixelate(attributes.width) if attributes.hasOwnProperty("width")
    attributes.height = @pixelate(attributes.height) if attributes.hasOwnProperty("height")
    
    if block
      @tag "td", attributes, block
    else
      @tag "td", value, attributes
    
    @cellIndex                     += 1
      
  recordKey: (recordOrKey) ->
    if typeof recordOrKey == "string"
      recordOrKey
    else
      recordOrKey.constructor.name
    
  idFor: (type, key, value, row_index = @row_index, column_index = @column_index) ->
    [key, type, row_index, column_index].compact.map (node) ->
      node.replace(/[\s_]/, "-")
    end.join("-")
 
  pixelate: (value) ->
    if typeof value == "string" then value else "#{value}px"

Tower.Controller.Elements =
  ClassMethods:
    # @extractElements $(".item a"), find: {meta: "span small"}, closest: {title: ".item h1"}
    extractElements: (target, options = {}) ->
      result = {}
    
      for method, selectors of options
        for key, selector of selectors
          result[key] = target[method](selector)
    
      result
    
    processElements: (target, options = {}) ->
      @elements = @extractElements(target, options)
    
    clickHandler: (name, handler, options) ->
      $(@dispatcher).on name, (event) =>
    
    submitHandler: (name, handler, options) ->
      $(@dispatcher).on name, (event) =>
        try
          target    = $(event.target)
          form      = target.closest("form")
          action    = form.attr("action")
          method    = (form.attr("data-method") || form.attr("method")).toUpperCase()
          params    = form.serializeParams()
    
          params.method = method
          params.action = action
        
          elements  = _.extend {target: target, form: form}, {}#, @extractElements(target, options)
          
          @_dispatch handler, elements: elements, params: params
        catch error
          console.log error
          
        return false
        
    invalidForm: ->
      element = $("##{@resourceName}-#{@elementName}")
    
      for attribute, errors of @resource.errors
        field = $("##{@resourceName}-#{attribute}-field")
        if field.length
          field.css("background", "yellow")
          $("input", field).after("<output class='error'>#{errors.join("\n")}</output>")


Tower.Controller.Events =
  ClassMethods:
    DOM_EVENTS: [
      "click", 
      "dblclick", 
      "blur", 
      "error", 
      "focus", 
      "focusIn", 
      "focusOut", 
      "hover", 
      "keydown", 
      "keypress", 
      "keyup", 
      "load", 
      "mousedown", 
      "mouseenter",
      "mouseleave",
      "mousemove",
      "mouseout",
      "mouseover",
      "mouseup", 
      "mousewheel",
      "ready",
      "resize",
      "scroll",
      "select",
      "submit",
      "tap",
      "taphold",
      "swipe",
      "swipeleft",
      "swiperight"
    ]
    
    dispatcher: global
    
    addEventHandler: (name, handler, options) ->
      if options.type == "socket" || !name.match(@DOM_EVENT_PATTERN)
        @addSocketEventHandler(name, handler, options)
      else
        @addDomEventHandler(name, handler, options)
        
    socketNamespace: ->
      Tower.Support.String.pluralize(Tower.Support.String.camelize(@name.replace(/(Controller)$/, ""), false))
      
    addSocketEventHandler: (name, handler, options) ->
      @io ||= Tower.Application.instance().io.connect(@socketNamespace())
      
      @io.on name, (data) =>
        @_dispatch undefined, handler, data 
    
    # http://www.ravelrumba.com/blog/event-delegation-jquery-performance/  
    addDomEventHandler: (name, handler, options) ->
      parts             = name.split(/\ +/)
      name              = parts.shift()
      selector          = parts.join(" ")
      options.target    = selector if selector && selector != ""
      options.target  ||= "body"
      eventType         = name.split(/[\.:]/)[0]
      method            = @["#{eventType}Handler"]
      if method
        method.call @, name, handler, options
      else
        $(@dispatcher).on name, options.target, (event) => @_dispatch handler, options
      @
      
    _dispatch: (handler, options = {}) ->
      controller = @instance()
      
      controller.elements ||= {}
      controller.params   ||= {}
      
      _.extend controller.params, options.params if options.params
      _.extend controller.elements, options.elements if options.elements
      
      if typeof handler == "string"
        controller[handler].call controller, event
      else
        handler.call controller, event
        
Tower.Controller.Events.ClassMethods.DOM_EVENT_PATTERN = new RegExp("^(#{Tower.Controller.Events.ClassMethods.DOM_EVENTS.join("|")})")
        

Tower.Controller.Handlers =
  ClassMethods:
    submitHandler: (name, handler, options) ->
      $(@dispatcher).on name, (event) =>
        target    = $(event.target)
        form      = target.closest("form")
        action    = form.attr("action")
        method    = (form.attr("data-method") || form.attr("method")).toUpperCase()
        params    = form.serializeParams()
  
        params.method = method
        params.action = action
  
        elements  = _.extend {target: target, form: form}, {}#, @extractElements(target, options)
      
        @_dispatch handler, elements: elements, params: params
    

$.fn.serializeParams = (coerce) ->
  $.serializeParams($(this).serialize(), coerce)
  
$.serializeParams = (params, coerce) ->
  obj = {}
  coerce_types =
    true: not 0
    false: not 1
    null: null
  
  array = params.replace(/\+/g, " ").split("&")
  
  for item, index in array
    param = item.split("=")
    key = decodeURIComponent(param[0])
    val = undefined
    cur = obj
    i = 0
    keys = key.split("][")
    keys_last = keys.length - 1
    if /\[/.test(keys[0]) and /\]$/.test(keys[keys_last])
      keys[keys_last] = keys[keys_last].replace(/\]$/, "")
      keys = keys.shift().split("[").concat(keys)
      keys_last = keys.length - 1
    else
      keys_last = 0
    if param.length is 2
      val = decodeURIComponent(param[1])
      val = (if val and not isNaN(val) then +val else (if val is "undefined" then `undefined` else (if coerce_types[val] isnt `undefined` then coerce_types[val] else val)))  if coerce
      if keys_last
        while i <= keys_last
          key = (if keys[i] is "" then cur.length else keys[i])
          cur = cur[key] = (if i < keys_last then cur[key] or (if keys[i + 1] and isNaN(keys[i + 1]) then {} else []) else val)
          i++
      else
        if $.isArray(obj[key])
          obj[key].push val
        else if obj[key] isnt `undefined`
          obj[key] = [ obj[key], val ]
        else
          obj[key] = val
    else obj[key] = (if coerce then `undefined` else "")  if key

  obj

Tower.View.MetaHelper =
  title: (string) ->
    document.title = string
Tower.View.ValidationHelper =    
  success: ->
    @redirectTo "/"
    
  failure: (error) ->
    if error
      @flashError(error)
    else
      @invalidate()
      
  invalidate: ->
    element = $("##{@resourceName}-#{@elementName}")
    
    for attribute, errors of @resource.errors
      field = $("##{@resourceName}-#{attribute}-field")
      if field.length
        field.css("background", "yellow")
        $("input", field).after("<output class='error'>#{errors.join("\n")}</output>")
class Tower.HTTP.Param.Array extends Tower.HTTP.Param
  parse: (value) ->
    values  = []
    array   = value.toString().split(/[,\|]/)
    
    for string in array
      isRange   = false
      negation  = !!string.match(/^\^/)
      string    = string.replace(/^\^/, "")
      
      string.replace /([^\.]+)?(\.{2})([^\.]+)?/, (_, startsOn, operator, endsOn) =>
        isRange = true
        range   = []
        range.push @parseValue(startsOn, ["$gte"]) if !!(startsOn && startsOn.match(/^\d/))
        range.push @parseValue(endsOn, ["$lte"])   if !!(endsOn && endsOn.match(/^\d/))
        values.push range
      
      unless isRange
        values.push [@parseValue(string, ["$eq"])]
      
    values


class Tower.HTTP.Param.Date extends Tower.HTTP.Param
  parse: (value) ->
    values  = []
    array   = value.toString().split(/[\s,\+]/)
    
    for string in array
      isRange = false
      
      string.replace /([^\.]+)?(\.\.)([^\.]+)?/, (_, startsOn, operator, endsOn) =>
        isRange = true
        range   = []
        range.push @parseValue(startsOn, ["$gte"]) if !!(startsOn && startsOn.match(/^\d/))
        range.push @parseValue(endsOn, ["$lte"])   if !!(endsOn && endsOn.match(/^\d/))
        values.push range
      
      values.push [@parseValue(string, ["$eq"])] unless isRange
    
    values
    
  parseValue: (value, operators) ->
    super(Tower.date(value), operators)
    

class Tower.HTTP.Param.Number extends Tower.HTTP.Param
  parse: (value) ->
    values  = []
    array   = value.toString().split(/[,\|]/)

    for string in array
      isRange   = false
      negation  = !!string.match(/^\^/)
      string    = string.replace(/^\^/, "")

      string.replace /([^\.]+)?(\.{2})([^\.]+)?/, (_, startsOn, operator, endsOn) =>
        isRange = true
        range   = []
        range.push @parseValue(startsOn, ["$gte"]) if !!(startsOn && startsOn.match(/^\d/))
        range.push @parseValue(endsOn, ["$lte"])   if !!(endsOn && endsOn.match(/^\d/))
        values.push range

      unless isRange
        values.push [@parseValue(string, ["$eq"])]

    values

  parseValue: (value, operators) ->
    super(parseFloat(value), operators)


class Tower.HTTP.Param.String extends Tower.HTTP.Param
  parse: (value) ->
    arrays = value.split(/(?:[\s|\+]OR[\s|\+]|\||,)/)
    
    for node, i in arrays
      values = []
      
      # ([\+\-\^]?[\w@\-_\s\d\.\$]+|-?\'[\w@-_\s\d\+\.\$]+\')
      node.replace /([\+\-\^]?[\w@_\s\d\.\$]+|-?\'[\w@-_\s\d\+\.\$]+\')/g, (_, token) =>
        negation    = false
        exact       = false
        
        token       = token.replace /^(\+?-+)/, (_, $1) ->
          negation  = $1 && $1.length > 0
          ""
          
        token       = token.replace /^\'(.+)\'$/, (_, $1) ->
          exact  = $1 && $1.length > 0
          $1
        
        if negation
          operators = [if exact then "$neq" else "$notMatch"]
        else
          operators = [if exact then "$eq" else "$match"]
        
        operators.push "^" if !!token.match(/^\+?\-?\^/)
        operators.push "$" if !!token.match(/\$$/)
        
        values.push @parseValue(@_clean(token), operators)
        _
      
      arrays[i] = values
    
    arrays


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
      

Tower.HTTP.Route.PolymorphicUrls =
  ClassMethods:
    polymorphicUrl: ->
      

Tower.HTTP.Route.Urls =
  ClassMethods:
    urlFor: (options) ->
      switch typeof(options)
        when "string"
          options
        else
          # https://github.com/kieran/barista/blob/master/lib/route.js#L157
          {controller, action, host, port, anchor} = options


Tower.Support.I18n.load model:
    errors:
      presence:             "%{attribute} can't be blank"
      minimum:              "%{attribute} must be a minimum of %{value}"
      maximum:              "%{attribute} must be a maximum of %{value}"
      length:               "%{attribute} must be equal to %{value}"
      format:               "%{attribute} must be match the format %{value}"
      inclusion:            "%{attribute} is not included in the list"
      exclusion:            "%{attribute} is reserved"
      invalid:              "%{attribute} is invalid"
      confirmation:         "%{attribute} doesn't match confirmation"
      accepted:             "%{attribute} must be accepted"
      empty:                "%{attribute} can't be empty"
      blank:                "%{attribute} can't be blank"
      tooLong:              "%{attribute} is too long (maximum is %{count} characters)"
      tooShort:             "%{attribute} is too short (minimum is %{count} characters)"
      wrongLength:          "%{attribute} is the wrong length (should be %{count} characters)"
      taken:                "%{attribute} has already been taken"
      notANumber:           "%{attribute} is not a number"
      greaterThan:          "%{attribute} must be greater than %{count}"
      greaterThanOrEqualTo: "%{attribute} must be greater than or equal to %{count}"
      equalTo:              "%{attribute} must be equal to %{count}"
      lessThan:             "%{attribute} must be less than %{count}"
      lessThanOrEqualTo:    "%{attribute} must be less than or equal to %{count}"
      odd:                  "%{attribute} must be odd"
      even:                 "%{attribute} must be even"
      recordInvalid:        "Validation failed: %{errors}"
      # Append your own errors here or at the model/attributes scope.
    fullMessages:           
      format:               "%{message}"
      #format:              "%{attribute} %{message}"

class Tower.Model.Relation.BelongsTo extends Tower.Model.Relation
  constructor: (owner, name, options = {}) ->
    super(owner, name, options)
    
    @foreignKey = "#{name}Id"
    owner.field @foreignKey, type: "Id"
    
    if @polymorphic
      @foreignType = "#{name}Type"
      owner.field @foreignType, type: "String"
    
    owner.prototype[name] = (callback) ->
      @relation(name).first(callback)
    
    self        = @
    
    owner.prototype["build#{Tower.Support.String.camelize(name)}"] = (attributes, callback) ->
      @buildRelation(name, attributes, callback)
      
    owner.prototype["create#{Tower.Support.String.camelize(name)}"] = (attributes, callback) ->
      @createRelation(name, attributes, callback)
      
  class @Scope extends @Scope
    # need to do something here about Reflection
  

class Tower.Model.Relation.HasMany extends Tower.Model.Relation
  class @Scope extends @Scope
    create: ->
      unless @owner.isPersisted()
        throw new Error("You cannot call create unless the parent is saved")
        
      relation        = @relation
      inverseRelation = relation.inverse()
      
      {criteria, data, options, callback} = @_extractArgs(arguments, data: true)
      
      id = @owner.get("id")
      
      if inverseRelation && inverseRelation.cache
        array = data[inverseRelation.cacheKey] || []
        array.push(id) if array.indexOf(id) == -1
        data[inverseRelation.cacheKey] = array
      else if relation.foreignKey
        data[relation.foreignKey]     = id if id != undefined
        # must check here if owner is instance of foreignType
        data[relation.foreignType]  ||= @owner.constructor.name if @relation.foreignType  
      
      criteria.where(data)
      criteria.mergeOptions(options)
      
      if inverseRelation && inverseRelation.counterCacheKey
        defaults  = {}
        defaults[inverseRelation.counterCacheKey] = 1
        criteria.where(defaults)
      
      instantiate = options.instantiate != false
      {attributes, options} = criteria.toCreate()
      
      options.instantiate = true
      
      @_create criteria, attributes, options, (error, record) =>
        unless error
          # add the id to the array on the owner record after it's created
          if relation && (relation.cache || relation.counterCache)
            if relation.cache
              push    = {}
              push[relation.cacheKey] = record.get("id")
            if relation.counterCacheKey
              inc     = {}
              inc[relation.counterCacheKey] = 1
            updates   = {}
            updates["$push"]  = push if push
            updates["$inc"]   = inc if inc
            @owner.updateAttributes updates, callback
          else
            callback.call @, error, record if callback
        else
          callback.call @, error, record if callback
          
    update: ->
      
    destroy: ->
      
    concat: ->
      
    _serializeAttributes: (attributes = {}) ->
      target = Tower.constant(@relation.targetClassName)
      
      for name, relation of target.relations()
        if attributes.hasOwnProperty(name)
          value = attributes[name]
          delete attributes[name]
          if relation instanceof Tower.Model.Relation.BelongsTo
            attributes[relation.foreignKey] = value.id
            attributes[relation.foreignType] = value.type if relation.polymorphic
            
      attributes
      
    toCriteria: ->
      criteria  = super
      relation  = @relation
      if relation.cache
        defaults  = {}
        defaults[relation.foreignKey + "s"] = $in: [@owner.get("id")]
        criteria.where(defaults)
      
      criteria
  

class Tower.Model.Relation.HasOne extends Tower.Model.Relation
  

Tower.Model.Scope.Finders =
  ClassMethods:
    finderMethods: [
      "find", 
      "all", 
      "first", 
      "last", 
      "count",
      "exists"
    ]
  
  find: ->
    {criteria, options, callback} = @_extractArgs(arguments, ids: true)
    {conditions, options} = criteria.toQuery()
    @_find conditions, options, callback
    
  first: (callback) ->
    {conditions, options} = @toQuery("asc")
    @store.findOne conditions, options, callback
    
  last: (callback) ->
    {conditions, options} = @toQuery("desc")
    @store.findOne conditions, options, callback
  
  all: (callback) ->
    {conditions, options} = @toQuery()
    @store.find conditions, options, callback
    
  count: (callback) ->
    {conditions, options} = @toQuery()
    @store.count conditions, options, callback
    
  exists: (callback) ->
    {conditions, options} = @toQuery()
    @store.exists conditions, options, callback
    
  batch: ->
    
  fetch: ->
    
  _find: (conditions, options, callback) ->
    if conditions.id && conditions.id.hasOwnProperty("$in") && conditions.id.$in.length == 1
      @store.findOne conditions, options, callback
    else if conditions.id && !conditions.id.hasOwnProperty("$in")
      conditions.id = {$in: Tower.Support.Object.toArray(conditions.id)}
      @store.findOne conditions, options, callback
    else
      @store.find conditions, options, callback
    

# @todo
Tower.Model.Scope.Modifiers =
  ClassMethods:
    atomicModifiers:
      "$set":     "$set"
      "$unset":   "$unset"
      "$push":    "$push"
      "$pushAll": "$pushAll"
      "$pull":    "$pull"
      "$pullAll": "$pullAll"
      "$inc":     "$inc"
      "$pop":     "$pop"
    
  # { $push : { field : value } }
  push: (record, updates, all) ->
    attributes  = record.attributes
    schema      = record.constructor.schema()
    changes     = record.changes
    
    for key, value of updates
      oldValue = attributes[key]
      
      attributes[key] ||= []
      
      # @todo check if valid type from schema!
      if all && _.isArray(value)
        attributes[key] = attributes[key].concat(value)
      else
        attributes[key].push(value)
      
      @changeAttribute(changes, key, oldValue, attributes[key])
    
    changes
  
  changeAttribute: (changes, key, oldValue, newValue) ->
    unless !!changes[key]
      changes[key]    = [oldValue, newValue]
    else
      changes[key][1] = newValue
    
    delete changes[key] if changes[key][0] == changes[key][1]
    
    changes
  
  # { $pushAll : { field : array } }
  pushAll: (record, updates) ->
    @push record, updates, true
    
  pull: (record, updates, all) ->
    attributes  = record.attributes
    schema      = record.constructor.schema()
    changes     = record.changes
    
    for key, value of updates
      attributeValue  = attributes[key]
      oldValue  = undefined
      if attributeValue && _.isArray(attributeValue)
        oldValue = attributeValue.concat()
        if all && _.isArray(value)
          for item in value
            attributeValue.splice _attributeValue.indexOf(item), 1
        else
          attributeValue.splice _attributeValue.indexOf(value), 1
      
      @changeAttribute(changes, key, oldValue, attributeValue)
    
    changes
    
  pullAll: (record, updates) ->
    @pull record, updates, true
    
  inc: (record, updates) ->
    attributes  = record.attributes
    schema      = record.constructor.schema()
    changes     = record.changes
    
    for key, value of updates
      oldValue = attributes[key]
      attributes[key] ||= 0
      attributes[key] += value
      
      @changeAttribute changes, key, oldValue, attributes[key]
      
    attributes
    
  set: (record, updates) ->
    attributes  = record.attributes
    schema      = record.constructor.schema()
    changes     = record.changes
    
    for key, value of updates
      field     = schema[key]
      oldValue  = attributes[key]
      if field && field.type == "Array" && !Tower.Support.Object.isArray(value)
        attributes[key] ||= []
        attributes[key].push value
      else
        attributes[key] = value
      
      @changeAttribute changes, key, oldValue, attributes[key]
      
    changes
    
  unset: (record, updates) ->
    attributes  = record.attributes
    changes     = record.changes
    
    for key, value of updates
      oldValue = attributes[key]
      attributes[key] = undefined
      
      @changeAttribute changes, key, oldValue, attributes[key]
      
    changes
    
  update: (record, updates) ->
    set     = null
    
    for key, value of updates
      if @isAtomicModifier(key)
        @["#{key.replace("$", "")}"](record, value)
      else
        set ||= {}
        set[key] = value
        
    @set(record, set) if set
    
    record
    
  assignAttributes: (attributes) ->
    for key, value of attributes
      delete @changes[key]
      @attributes[key] = value
    @
    
  resetAttributes: (keys) ->
    @resetAttributes(key) for key in keys
    @
    
  resetAttribute: (key) ->
    array = @changes[key]
    if array
      delete @changes[key]
      @attributes[key] = array[0]
    @
    
  toUpdates: (record) ->
    result  = {}
    changes = record.changes
    schema  = record.constructor.schema()
    
    for key, value of changes
      field = field[key]
      if field
        if field.type == "Array"
          pop   = _.difference(value[0], value[1])
        
          if pop.length > 0
            result.$pop ||= {}
            result.$pop[key] = pop
        
          push  = _.difference(value[1], value[0])
        
          if push.length > 0
            result.$push ||= {}
            result.$push[key] = push
        else if field.type == "Integer"
          result.$inc ||= {}
          result.$inc[key] = (value[1] || 0) - (value[0] || 0)
      else
        result[key]
      
    result
    

Tower.Model.Scope.Persistence =
  ClassMethods:
    persistenceMethods: [
      "create", 
      "update", 
      "destroy"
    ]
  
  build: (attributes, options) ->
    {conditions, options} = @toCreate()
    @_build attributes, conditions, options
  
  # User.create(firstName: "Lance")
  # User.where(firstName: "Lance").create()
  # User.where(firstName: "Lance").create([{lastName: "Pollard"}, {lastName: "Smith"}])
  # User.where(firstName: "Lance").create(new User(lastName: "Pollard"))
  # create(attributes)
  # create([attributes, attributes])
  # create(attributes, options)
  create: ->
    {criteria, data, options, callback} = @_extractArgs(arguments, data: true)
    criteria.mergeOptions(options)
    @_create criteria, data, options, callback
  
  # User.where(firstName: "Lance").update(1, 2, 3)
  # User.update(User.first(), User.last(), firstName: "Lance")
  # User.update([User.first(), User.last()], firstName: "Lance")
  # User.update([1, 2], firstName: "Lance")
  update: ->
    {criteria, data, options, callback} = @_extractArgs(arguments, ids: true, data: true)
    criteria.mergeOptions(options)
    @_update criteria, data, options, callback
    
  destroy: ->
    {criteria, options, callback} = @_extractArgs(arguments, ids: true)
    criteria.mergeOptions(options)
    @_destroy criteria, options, callback
    
  sync: ->
  
  transaction: ->
    
  _build: (attributes, conditions, options) ->
    if Tower.Support.Object.isArray(attributes)
      result  = []
      for object in attributes
        result.push @store.serializeModel(Tower.Support.Object.extend({}, conditions, object))
      result
    else
      @store.serializeModel(Tower.Support.Object.extend({}, conditions, attributes))
  
  _create: (criteria, data, opts, callback) ->
    if opts.instantiate
      isArray = Tower.Support.Object.isArray(data)
      records = Tower.Support.Object.toArray(@build(data))
      
      iterator = (record, next) ->
        if record
          record.save(next)
        else
          next()
        
      Tower.async records, iterator, (error) =>
        unless callback
          throw error if error
        else
          return callback(error) if error
          if isArray
            callback(error, records)
          else
            callback(error, records[0])
    else
      @store.create data, opts, callback
      
  _update: (criteria, data, opts, callback) ->    
    {conditions, options} = criteria.toQuery()
    if opts.instantiate
      iterator = (record, next) ->
        record.updateAttributes(data, next)
        
      @_each conditions, options, iterator, callback
    else
      @store.update data, conditions, options, callback
  
  _destroy: (criteria, opts, callback) ->
    {conditions, options} = criteria.toQuery()
    
    if opts.instantiate
      iterator = (record, next) ->
        record.destroy(next)
        
      @_each conditions, options, iterator, callback
    else
      @store.destroy conditions, options, callback
    
  _each: (conditions, options, iterator, callback) ->
    @store.find conditions, options, (error, records) =>
      if error
        callback.call @, error, records
      else
        Tower.async records, iterator, (error) =>
          unless callback
            throw error if error
          else
            callback.call @, error, records if callback
    
    

Tower.Model.Scope.Queries =
  ClassMethods:
    queryMethods: [
      "where", 
      "order", 
      "asc", 
      "desc", 
      "limit", 
      "offset", 
      "select", 
      "joins", 
      "includes", 
      "excludes", 
      "paginate", 
      "within", 
      "allIn", 
      "allOf", 
      "alsoIn", 
      "anyIn", 
      "anyOf", 
      "near", 
      "notIn"
    ]
  
    queryOperators:
      ">=":       "$gte"
      "$gte":     "$gte"
      ">":        "$gt"
      "$gt":      "$gt"
      "<=":       "$lte"
      "$lte":     "$lte"
      "<":        "$lt"
      "$lt":      "$lt"
      "$in":      "$in"
      "$nin":     "$nin"
      "$any":     "$any"
      "$all":     "$all"
      "=~":       "$regex"
      "$m":       "$regex"
      "$regex":   "$regex"
      "$match":   "$match"
      "$notMatch":   "$notMatch"
      "!~":       "$nm"
      "$nm":      "$nm"
      "=":        "$eq"
      "$eq":      "$eq"
      "!=":       "$neq"
      "$neq":     "$neq"
      "$null":    "$null"
      "$notNull": "$notNull"
      

class Tower.Model.Validator.Format
  constructor: (value, attributes) ->
    super(value, attributes)
    
    @value = if typeof(value) == 'string' then new RegExp(value) else value
  
  validate: (record, attribute, errors, callback) ->
    value   = record.get(attribute)
    
    unless !!@value.exec(value)
      return @failure(
        record,
        attribute,
        errors,
        Tower.t("model.errors.format", attribute: attribute, value: @value.toString())
        callback
      )
    else
      @success(callback)
    

class Tower.Model.Validator.Length extends Tower.Model.Validator
  constructor: (name, value, attributes) ->
    super
    
    @validate = switch name
      when "min" then @validateMinimum
      when "max" then @validateMaximum
      else
        @validateLength
  
  validateMinimum: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    unless typeof(value) == 'number' && value >= @value
      return @failure(
        record, 
        attribute, 
        errors, 
        Tower.t("model.errors.minimum", attribute: attribute, value: @value), 
        callback
      )
    @success(callback)
  
  validateMaximum: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    unless typeof(value) == 'number' && value <= @value
      return @failure(
        record,
        attribute,
        errors,
        Tower.t("model.errors.maximum", attribute: attribute, value: @value),
        callback
      )
    @success(callback)
  
  validateLength: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    unless typeof(value) == 'number' && value == @value
      return @failure(
        record,
        attribute,
        errors,
        Tower.t("model.errors.length", attribute: attribute, value: @value)
        callback
      )
    @success(callback)


class Tower.Model.Validator.Presence extends Tower.Model.Validator
  validate: (record, attribute, errors, callback) ->
    unless Tower.Support.Object.isPresent(record.get(attribute))
      return @failure(
        record,
        attribute,
        errors,
        Tower.t("model.errors.presence", attribute: attribute),
        callback
      )
    @success(callback)


class Tower.Model.Validator.Uniqueness extends Tower.Model.Validator
  validate: (record, attribute, errors, callback) ->
    value       = record.get(attribute)
    conditions  = {}
    conditions[attribute] = value
    record.constructor.where(conditions).exists (error, result) =>
      if result
        return @failure(
          record,
          attribute,
          errors,
          Tower.t("model.errors.uniqueness", attribute: attribute, value: value),
          callback
        )
      else
        @success(callback)


Tower.Controller.Caching =
  freshWhen: ->
    
  stale: ->
    
  expiresIn: ->
    

Tower.Controller.Events =
  ClassMethods:
    addEventHandler: (name, handler, options) ->
      @_addSocketEventHandler name, handler, options
        
    socketNamespace: ->
      Tower.Support.String.pluralize(Tower.Support.String.camelize(@name.replace(/(Controller)$/, ""), false))
      
    addSocketEventHandler: (name, handler, options) ->
      unless @io
        @_socketHandlers = {}
        
        @io = Tower.Application.instance().socket.of(@socketNamespace()).on "connection", (socket) =>
          for eventType, handler of @_socketHandlers
            do (eventType, handler) ->
              if eventType isnt 'connection' and eventType isnt 'disconnect'
                socket.on eventType, (data) =>
                  @_dispatch undefined, handler, data
      
      @_socketHandlers[name] = handler
      
    _dispatch: (event, handler, locals = {}) ->
      controller = new @
      
      for key, value of locals
        controller.params[key] = value
        
      if typeof handler == "string"
        controller[handler].call controller, event
      else
        handler.call controller, event
    

Tower.Controller.HTTP =
  head: (status, options = {}) ->
    if typeof status == "object"
      options = status
      status  = null
      
    status  ||= options.status || "ok"
    location  = options.location
    
    delete options.status
    delete options.location

    #for key, value of options
    #  @headers[key.dasherize.split('-').each { |v| v[0] = v[0].chr.upcase }.join('-')] = value.to_s

    @status       = status
    @location     = Tower.urlFor(location) if location
    @headers["Content-Type"] = Mime[formats.first] if formats
    @body         = " "
    

Tower.Controller.addRenderers
  json: (json, options, callback) ->
    json = JSON.stringify(json) unless typeof(json) == "string"
    json = "#{options.callback}(#{json})" if options.callback
    @headers["Content-Type"] ||= require("mime").lookup("json")
    callback null, json if callback
    json
  
  # https://github.com/wdavidw/node-csv-parser
  # csv: (csv, options, callback) ->
    
  # https://github.com/devongovett/pdfkit
  # pdf: (data, options, callback) ->
    
Tower.Controller.Sockets =
  broadcast: ->
    
  emit: ->
    
  connect: ->
      

Tower.Mailer.Configuration =
  ClassMethods:
    lib: -> require('mailer')
  

Tower.Mailer.Rendering =  
  ClassMethods:    
    mail: (options = {}, callback) ->
      @host     = options.host
      @port     = options.port
      @domain   = options.domain
      @to       = options.to
      @from     = options.from
      @subject  = options.subject
      @locals   = options.locals || {}
      @template = options.template
  
  deliver: ->
    email = @constructor.lib()
    self  = @
    
    Shift.render path: @template, @locals, (error, body) ->
      options =
        host:           self.host
        port:           self.port
        domain:         self.domain
        to:             self.to
        from:           self.from
        subject:        self.subject
        body:           body  
        authentication: self.login
        username:       self.username
        password:       self.password

      email.send options, (error, result) ->
        console.log error if error
        console.log result


Tower.Support.I18n.load date:
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

class Tower.View.Form.Builder extends Tower.View.Component
  constructor: (args, options = {}) ->
    @template       = options.template
    @model          = options.model
    @attribute      = options.attribute
    @parentIndex    = options.parentIndex
    @index          = options.index
    @tabindex       = options.tabindex
    @accessKeys     = options.accessKeys
    #@attributes     = @cloneAttributes(options.except(:template, :model, :attribute, :accessKeys, :index, :tabindex))
    
  defaultOptions: (options = {}) ->
    options.model     ||= @model
    options.index     ||= @index
    options.attribute ||= @attribute
    options.template  ||= @template
    options
  
  fieldset: (args...) ->  
    block                   = args.pop()
    options                 = @defaultOptions(Tower.Support.Array.extractOptions(args))
    options.label           ||= args.shift()
    
    new Tower.View.Form.Fieldset([], options).render(block)
    
  fields: ->
    args              = Tower.Support.Array.args(arguments)
    block             = Tower.Support.Array.extractBlock(args)
    options           = Tower.Support.Array.extractOptions(args)
    options.as        = "fields"
    options.label   ||= false
    attribute         = args.shift() || @attribute
    
    @field attribute, options, (_field) =>
      @fieldset(block)
      
  fieldsFor: ->
    options        = args.extractOptions
    attribute      = args.shift
    macro          = model.macroFor(attribute)
    attrName      = nil
    
    if options.as == "object"
      attrName = attribute.toS
    else
      attrName = if Tower.View.renameNestedAttributes then "#{attribute}_attributes" else attribute.toS

    # -> something here for counts
    subParent     = model.object
    subObject     = args.shift
  
    index          = options.delete("index")
  
    unless index.present? && typeof index == "string"
      if subObject.blank? && index.present?
        subObject   = subParent.send(attribute)[index]
      else if index.blank? && subObject.present? && macro == "hasMany"
        index        = subParent.send(attribute).index(subObject)

    subObject   ||= model.default(attribute) || model.toS.camelize.constantize.new
    keys           = [model.keys, attrName]
    
    options.merge(
      template:    template
      model:       model
      parentIndex: index
      accessKeys:  accessKeys
      tabindex:    tabindex
    )
    
    new Tower.View.Form.Builder(options).render(block)

  field: ->  
    args          = Tower.Support.Array.args(arguments)
    last          = args[args.length - 1]
    args.pop() if last == null || last == undefined
    block         = Tower.Support.Array.extractBlock(args)
    options       = Tower.Support.Array.extractOptions(args)
    attributeName = args.shift() || "attribute.name"
    #attribute      = Storefront:"Attribute".new(
    #  name:     attributeName,
    #  model:    @model, 
    #  required: options.required == true, 
    #  disabled: options.disabled == true,
    #  topLevel: options.attribute == false
    #)
    
    defaults = 
      template:    @template
      model:       @model
      attribute:   attributeName, 
      parentIndex: @parentIndex
      index:       @index
      fieldHTML:   options.fieldHTML || {}
      inputHTML:   options.inputHTML || {}
      labelHTML:   options.labelHTML || {}
      errorHTML:   options.errorHTML || {}
      hintHtml:    options.hintHtml  || {}
    
    new Tower.View.Form.Field([], _.extend(defaults, options)).render(block)

  button: ->
    args          = Tower.Support.Array.args(arguments)
    block         = Tower.Support.Array.extractBlock(args)
    options       = Tower.Support.Array.extractOptions(args)
    options.as  ||= "submit"
    options.value = args.shift() || "Submit"
    options.class = Tower.View.submitFieldsetClass if options.as == "submit"
    @field options.value, options, block
  
  submit: @::button

  partial: (path, options = {}) ->
    @template.render partial: path, locals: options.merge(fields: self)

  tag: (key, args...) ->
    @template.tag key, args
    
  render: (block) ->
    block(@)
class Tower.View.Form.Field extends Tower.View.Component
  addClass: (string, args) ->
    result = if string then string.split(/\s+/g) else []
    for arg in args
      continue unless arg
      result.push(arg) unless result.indexOf(arg) > -1
    result.join(" ")
    
  toId: (options = {}) ->
    result = Tower.Support.String.parameterize(@model.constructor.name)#@model.toKey()
    result += "-#{options.parentIndex}" if options.parentIndex
    result += "-#{Tower.Support.String.parameterize(@attribute)}"
    result += "-#{options.type || "field"}"
    result += "-#{@index}" if @index?
    result
    
  toParam: (options = {}) ->
    result = Tower.Support.String.parameterize(@model.constructor.name)#@model.toKey()
    result += "[#{options.parentIndex}]" if options.parentIndex
    result += "[#{@attribute}]"
    result += "[#{@index}]" if @index?
    result
    
  constructor: (args, options) ->
    @labelValue = options.label
    delete options.label
    
    super(args, options)
    
    @required ||= false
    
    # input type
    field           = @model.constructor.fields()[@attribute]
    
    options.as    ||= if field then Tower.Support.String.camelize(field.type, true) else "string"
    @inputType      = inputType = options.as
    @required       = !!(field && field.required == true)
    
    # class
    classes = [Tower.View.fieldClass, inputType]
    unless ["submit", "fieldset"].indexOf(inputType) > -1
      classes.push if field.required then Tower.View.requiredClass else Tower.View.optionalClass
      classes.push if field.errors then Tower.View.errorClass else Tower.View.validClass
      
      if options.validate != false && field.validations
        classes.push Tower.View.validateClass
    
    @fieldHTML.class = @addClass @fieldHTML.class, classes
    
    # id
    if !@fieldHTML.id && Tower.View.idEnabledOn.indexOf("field") > -1
      @fieldHTML.id = @toId(type: "field", index: @index, parentIndex: @parentIndex)
    
    @inputHTML.id = @toId(type: "input", index: @index, parentIndex: @parentIndex)
    unless ["hidden", "submit"].indexOf(inputType) > -1
      @labelHTML.for ||= @inputHTML.id
      @labelHTML.class = @addClass @labelHTML.class, [Tower.View.labelClass]
    
      unless @labelValue == false
        @labelValue ||= Tower.Support.String.camelize(@attribute.toString())
      
      unless options.hint == false
        @errorHTML.class = @addClass @errorHTML.class, [Tower.View.errorClass]
        if Tower.View.includeAria && Tower.View.hintIsPopup
          @errorHTML.role ||= "tooltip"

    @attributes       = @fieldHTML
    
    @inputHTML.name ||= @toParam() unless inputType == "submit"
    
    @value          = options.value
    @dynamic        = options.dynamic == true
    @richInput      = if options.hasOwnProperty("rich_input") then !!options.rich_input else Tower.View.richInput
  
    @validate       = options.validate != false
  
    classes         = [inputType, Tower.Support.String.parameterize(@attribute), @inputHTML.class]
    
    unless ["submit", "fieldset"].indexOf(inputType) > -1
      classes.push if field.required then Tower.View.requiredClass else Tower.View.optionalClass
      classes.push if field.errors then Tower.View.errorClass else Tower.View.validClass
      classes.push "input"
        
      if options.validate != false && field.validations
        classes.push Tower.View.validateClass
    
    # class
    @inputHTML.class = @addClass @inputHTML.class, classes
    @inputHTML.placeholder = options.placeholder if options.placeholder
  
    # value
    unless @inputHTML.value?
      if options.hasOwnProperty("value")
        @inputHTML.value = options.value
      unless @inputHTML.value?
        value = @model.get(@attribute)
        @inputHTML.value = value if value
  
    # @inputHTML[:tabindex]      = @tabindex
    @inputHTML.maxlength    ||= options.max if options.hasOwnProperty("max")
    
    # expressions
    pattern                       = options.match
    pattern                       = pattern.toString() if _.isRegExp(pattern)
    @inputHTML["data-match"]      = pattern if pattern?
    @inputHTML["aria-required"]   = @required.toString()
    
    @inputHTML.required = "true" if @required == true
    @inputHTML.disabled = "true" if @disabled
    @inputHTML.autofocus = "true" if @autofocus == true
    @inputHTML["data-dynamic"] = "true" if @dynamic
    
    @inputHTML.title ||= @inputHTML.placeholder if @inputHTML.placeholder
    
    @autocomplete = @inputHTML.autocomplete == true
    
    if @autocomplete && Tower.View.includeAria
      @inputHTML["aria-autocomplete"] = switch @autocomplete
        when "inline", "list", "both"
          @autocomplete
        else
          "both"
  
  input: (args...) ->
    options = _.extend @inputHTML, Tower.Support.Array.extractOptions(args)
    key     = args.shift() || @attribute
    @["#{@inputType}Input"](key, options)  
  
  checkboxInput: (key, options) ->
    @tag "input", _.extend(type: "checkbox", options)
    
  stringInput: (key, options) ->
    @tag "input", _.extend(type: "text", options)
    
  submitInput: (key, options) ->
    @tag "input", _.extend(type: "submit", options)
    
  fileInput: (key, options) ->
    @tag "input", _.extend(type: "file", options)
    
  textInput: (key, options) ->
    @tag "textarea", options
  
  password_input: (key, options) ->
    @tag "input", _.extend(type: "password", options)
    
  emailInput: (key, options) ->
    @tag "input", _.extend(type: "email", options)
    
  urlInput: (key, options) ->
    @tag "input", _.extend(type: "url", options)
    
  numberInput: (key, options) ->
    @tag "input", _.extend(type: "string", "data-type": "numeric", options)
    
  searchInput: (key, options) ->
    @tag "input", _.extend(type: "search", "data-type": "search", options)
    
  phoneInput: (key, options) ->
    @tag "input", _.extend(type: "tel", "data-type": "phone", options)
  
  label: ->
    return unless @labelValue
    @tag "label", @labelHTML, =>
      @tag "span", @labelValue
      if @required
        @tag "abbr", title: Tower.View.requiredTitle, class: Tower.View.requiredClass, -> Tower.View.requiredAbbr
      else
        @tag "abbr", title: Tower.View.optionalTitle, class: Tower.View.optionalClass, -> Tower.View.optionalAbbr
    
  render: (block) ->
    @tag Tower.View.fieldTag, @attributes, =>
      if block
        block.call @
      else
        @label()
        @input()
      
      #elements = extractElements!(attributes)
      #
      #result = elements.map do |element|
      #  Array(send(element)).map(&"render")
      #template.hamlConcat result.flatten.join.gsub(/\n$/, "") if result.present?
      #
      #yield(self) if blockGiven? # template.captureHaml(self, block)
      
  extractElements: (options = {}) ->
    elements = []
    if ["hidden", "submit"].include?(inputType)
      elements.push "inputs"
    else
      if @label.present? && @label.value?
        elements.push "label"
      elements = elements.concat ["inputs", "hints", "errors"]
    elements
class Tower.View.Form.Fieldset extends Tower.View.Component
  constructor: (args, options) ->
    super
    #@label      = @localize("titles", options[:label], nil, (attributes[:locale_options] || {}).merge(:allow_blank => true)) if options[:label].present?
    
    #merge_class! attributes, *[
    #  config.fieldset_class
    #]
    @attributes = attributes = {}
    
    #attributes.id ||= label.underscore.strip.gsub(/[_\s]+/, config.separator) if label.present?
    
    delete attributes.index
    delete attributes.parentIndex
    delete attributes.label
    
    @builder     = new Tower.View.Form.Builder([], 
      template:     @template
      model:        @model
      attribute:    @attribute
      index:        @index
      parentIndex:  @parentIndex
    )
  
  # form.inputs :basic_info, :locale_options => {:count => 1, :past => true}
  render: (block) ->
    @tag "fieldset", @attributes, =>
      if @label
        @tag "legend", class: Tower.View.legendClass, =>
          @tag "span", @label
      @tag Tower.View.fieldListTag, class: Tower.View.fieldListClass, =>
        @builder.render(block)


Tower.View.ComponentHelper =
  formFor: ->
    Tower.View.Form.render(__ck, arguments...)
    
  tableFor: ->
    Tower.View.Table.render(__ck, arguments...)
    
  widget: ->
    
  linkTo: (title, path, options = {}) ->
    a _.extend(options, href: path, title: title), title.toString()


Tower.View.ElementHelper =
  title: (value) ->
    document.title = value
    
  addClass: (string, parts...) ->
    classes = string.split(/\ +/)
    for part in parts
      classes.push(part) if classes.indexOf(part) > -1
    classes.join(" ")
    
  # @elementId @user, "form"
  #   #=> "#user-form"
  #
  # @elementId @user, "firstName", "field"
  #   #=> "#user-first-name-field"
  elementId: ->
    "##{@elementKey(arguments...)}"
    
  elementClass: ->
    ".#{@elementKey(arguments...)}"
    
  elementKey: ->
    Tower.Support.String.parameterize(@elementNameComponents(arguments...).join("-"))
  
  # @elementName @user, "firstName"
  #   #=> "user[firstName]"
  #
  # @elementName @user, "address", "city"
  #   #=> "user[address][city]"
  elementName: ->
    result  = @elementNameComponents(arguments...)
    i       = 1
    
    for item, i in result
      result[i] = "[#{item}]"
      
    Tower.Support.String.parameterize(result.join(""))
    
  elementNameComponents: ->
    args    = Tower.Support.Array.args(arguments)
    result  = []
    
    for item in args
      switch typeof item
        when "function"
          result.push item.constructor.name
        when "string"
          result.push item
        else
          result.push item.toString()
          
    result
    

for filter in ["stylus", "less", "markdown"]
  @[filter] = (text) ->
    Tower.View.render(text, filter: filter)
Tower.View.HeadHelper =
  metaTag: (name, content) ->
    meta name: name, content: content
  
  snapshotLinkTag: (href) ->
    linkTag rel: "imageSrc", href: href
  
  html4ContentTypeTag: (charset = "UTF-8", type = "text/html") ->
    httpMetaTag "Content-Type", "#{type}; charset=#{charset}"
    
  chromeFrameTag: ->
    html4ContentTypeTag()
    meta "http-equiv": "X-UA-Compatible", content: "IE=Edge,chrome=1"
  
  html5ContentTypeTag: (charset = "UTF-8") ->
    meta charset: charset
    
  contentTypeTag: (charset) ->
    html5ContentTypeTag charset

  csrfMetaTag: ->
    metaTag "csrf-token", @request.session._csrf
    
  searchLinkTag: (href, title) ->
    linkTag rel: "search", type: "application/opensearchdescription+xml", href: href, title: title
  
  faviconLinkTag: (favicon = "/favicon.ico") ->
    linkTag rel: "shortcut icon", href: favicon, type: "image/x-icon"
  
  linkTag: (options = {}) ->
    link options
  
  ieApplicationMetaTags: (title, options = {}) ->
    result = []
    
    result.push metaTag("application-name", title)
    result.push metaTag("msapplication-tooltip", options.tooltip) if options.hasOwnProperty("tooltip")
    result.push metaTag("msapplication-starturl", options.url) if options.hasOwnProperty("url")
    
    if options.hasOwnProperty("width") && options.hasOwnProperty("height")
      result.push metaTag("msapplication-window", "width=#{options.width};height=#{options.height}")
      result.push metaTag("msapplication-navbutton-color", options.color) if options.hasOwnProperty("color")
      
    result.join("\n")
  
  ieTaskMetaTag: (name, path, icon = null) ->
    content = []
    
    content.push "name=#{name}"
    content.push "uri=#{path}"
    content.push "icon-uri=#{icon}" if icon
    
    @metaTag "msapplication-task", content.join(";")
  
  appleMetaTags: (options = {}) ->
    result = []
    
    result.push appleViewportMetaTag(options)
    result.push appleFullScreenMetaTag(options.fullScreen) if options.hasOwnProperty("fullScreen")
    result.push appleMobileCompatibleMetaTag(options.mobile) if options.hasOwnProperty("mobile")
    
    result.join()
  
  # http://www.html5rocks.com/en/mobile/mobifying.html
  appleViewportMetaTag: (options = {}) ->
    viewport = []
    
    viewport.push "width=#{options.width}" if options.hasOwnProperty("width")
    viewport.push "height=#{options.height}" if options.hasOwnProperty("height")
    viewport.push "initial-scale=#{options.scale || 1.0}"
    viewport.push "minimum-scale=#{options.min}" if options.hasOwnProperty("min")
    viewport.push "maximum-scale=#{options.max}" if options.hasOwnProperty("max")
    viewport.push "user-scalable=#{boolean(options.scalable)}" if options.hasOwnProperty("scalable")
    
    metaTag "viewport", viewport.join(", ")
  
  appleFullScreenMetaTag: (value) ->
    metaTag "apple-touch-fullscreen", boolean(value)
  
  appleMobileCompatibleMetaTag: (value) ->
    metaTag "apple-mobile-web-app-capable", boolean(value)
  
  appleTouchIconLinkTag: (path, options = {}) ->
    rel = ["apple-touch-icon"]
    rel.push "#{options.size}x#{options.size}" if options.hasOwnProperty("size")
    rel.push "precomposed" if options.precomposed
    
    linkTag rel: rel.join("-"), href: path
  
  appleTouchIconLinkTags: (path, sizes...) ->
    if typeof sizes[sizes.length - 1] == "object"
      options = sizes.pop()
    else
      options = {}
      
    result  = []
    
    for size in sizes
      result.push appleTouchIconLinkTag(path, _.extend(size: size, options))
      
    result.join()
  
  openGraphMetaTags: (options = {}) ->
    openGraphMetaTag("og:title", options.title) if options.title
    openGraphMetaTag("og:type", options.type) if options.type
    openGraphMetaTag("og:image", options.image) if options.image
    openGraphMetaTag("og:siteName", options.site) if options.site
    openGraphMetaTag("og:description", options.description) if options.description
    openGraphMetaTag("og:email", options.email) if options.email
    openGraphMetaTag("og:phoneNumber", options.phone) if options.phone
    openGraphMetaTag("og:faxNumber", options.fax) if options.fax
    openGraphMetaTag("og:latitude", options.lat) if options.lat
    openGraphMetaTag("og:longitude", options.lng) if options.lng
    openGraphMetaTag("og:street-address", options.street) if options.street
    openGraphMetaTag("og:locality", options.city) if options.city
    openGraphMetaTag("og:region", options.state) if options.state
    openGraphMetaTag("og:postal-code", options.zip) if options.zip
    openGraphMetaTag("og:country-name", options.country) if options.country
    
    null
  
  openGraphMetaTag: (property, content) ->
    meta property: property, content: content


Tower.View.RenderingHelper =
  partial: (path, options, callback) ->
    try
      if typeof options == "function"
        callback  = options
        options   = {}
      options   ||= {}
      options.locals ||= {}
      locals      = options.locals
      path        = path.split("/")
      path[path.length - 1] = "_#{path[path.length - 1]}"
      path        = path.join("/")
      prefixes    = options.prefixes
      prefixes  ||= [@_context.collectionName] if @_context
      template    = @_readTemplate(path, prefixes, options.type || Tower.View.engine)
      template    = @renderWithEngine(String(template))
      if options.collection
        name      = options.as || Tower.Support.String.camelize(options.collection[0].constructor.name, true)
        tmpl      = eval "(function(data) { with(data) { this.#{name} = #{name}; #{String(template)} } })"
        for item in options.collection
          locals[name] = item
          tmpl.call(@, locals)
          delete @[name]
      else
        tmpl      = "(function(data) { with(data) { #{String(template)} } })"
        eval(tmpl).call(@, locals)
    catch error
      console.log error.stack || error
      
    null
    
  page: ->
    args          = Tower.Support.Array.args(arguments)
    options       = Tower.Support.Array.extractOptions(args)
    browserTitle  = args.shift() || options.title
    
    @contentFor "title", ->
      title browserTitle
      
  urlFor: ->
    Tower.urlFor(arguments...)
    
  yields: (key) ->
    value = @[key]
    if typeof value == "function"
      eval("(#{String(value)})()")
    else
      #__ck.indent()
      ending = if value.match(/\n$/) then "\n" else ""
      text(value.replace(/\n$/, "").replace(/^(?!\s+$)/mg, __ck.repeat('  ', __ck.tabs)) + ending)
    null
  
  hasContentFor: (key) ->
    !!(@hasOwnProperty(key) && @[key] && @[key] != "")
    
  has: (key) ->
    !!(@hasOwnProperty(key) && @[key] && @[key] != "")
    
  contentFor: (key, block) ->
    @[key] = block
    null
Tower.View.StringHelper =  
  # Characters that need to be escaped to HTML entities from user input
  HTML_ESCAPE:
    '&': '&amp;'
    '<': '&lt;'
    '>': '&gt;'
    '"': '&quot;'
    "'": '&#039;'
    
  preserve: (text) ->
    text.replace(/\n/g, '&#x000A;').replace(/\r/g, '')
    
  htmlEscape: (text) ->
    text.replace /[\"><&]/g, (_) => @HTML_ESCAPE[_]
  
  t: (string) ->
    Tower.Support.I18n.translate(string)
  
  l: (object) ->
    Tower.Support.I18n.localize(string)
    
  boolean: (boolean) ->
    if boolean then "yes" else "no"


