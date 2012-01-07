class Tower.Controller extends Tower.Class
  @extend   Tower.Support.EventEmitter
  @include  Tower.Support.EventEmitter
  
  constructor: ->
    @constructor.instance = @
    @headers              = {}
    @status               = 200
    @request              = null
    @response             = null
    @contentType          = "text/html"
    @params               = {}
    @query                = {}
    @resourceName         = @constructor.resourceName()
    @resourceType         = @constructor.resourceType()
    @collectionName       = @constructor.collectionName()
    
    if @constructor._belongsTo
      @hasParent          = true
    else
      @hasParent          = false

require './controller/callbacks'
require './controller/helpers'
require './controller/http'
require './controller/layouts'
require './controller/params'
require './controller/processing'
require './controller/redirecting'
require './controller/rendering'
require './controller/resources'
require './controller/responding'
require './controller/sockets'

Tower.Controller.include Tower.Controller.Callbacks
Tower.Controller.include Tower.Controller.Helpers
Tower.Controller.include Tower.Controller.HTTP
Tower.Controller.include Tower.Controller.Layouts
Tower.Controller.include Tower.Controller.Params
Tower.Controller.include Tower.Controller.Processing
Tower.Controller.include Tower.Controller.Redirecting
Tower.Controller.include Tower.Controller.Rendering
Tower.Controller.include Tower.Controller.Resources
Tower.Controller.include Tower.Controller.Responding
Tower.Controller.include Tower.Controller.Sockets

module.exports = Tower.Controller
