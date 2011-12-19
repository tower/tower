class Coach.Controller extends Coach.Class
  @extend   Coach.Support.EventEmitter
  @include  Coach.Support.EventEmitter
  
  constructor: ->
    @constructor.instance = @
    @headers      = {}
    @status       = 200
    @request      = null
    @response     = null
    @contentType = "text/html"
    @params       = {}
    @query        = {}
    @resourceName   = @constructor.resourceName
    @resourceType   = @constructor.resourceType
    @collectionName = @constructor.collectionName
    
    if @constructor._belongsTo
      @hasParent    = true
    else
      @hasParent    = false

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

Coach.Controller.include Coach.Controller.Callbacks
Coach.Controller.include Coach.Controller.Helpers
Coach.Controller.include Coach.Controller.HTTP
Coach.Controller.include Coach.Controller.Layouts
Coach.Controller.include Coach.Controller.Params
Coach.Controller.include Coach.Controller.Processing
Coach.Controller.include Coach.Controller.Redirecting
Coach.Controller.include Coach.Controller.Rendering
Coach.Controller.include Coach.Controller.Resources
Coach.Controller.include Coach.Controller.Responding
Coach.Controller.include Coach.Controller.Sockets

module.exports = Coach.Controller
