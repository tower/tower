class Metro.Controller extends Metro.Object
  constructor: ->
    @headers      = {}
    @status       = 200
    @request      = null
    @response     = null
    @contentType = "text/html"
    @params       = {}
    @query        = {}

require './controller/caching'
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

Metro.Controller.include Metro.Controller.Caching
Metro.Controller.include Metro.Controller.Helpers
Metro.Controller.include Metro.Controller.HTTP
Metro.Controller.include Metro.Controller.Layouts
Metro.Controller.include Metro.Controller.Params
Metro.Controller.include Metro.Controller.Processing
Metro.Controller.include Metro.Controller.Redirecting
Metro.Controller.include Metro.Controller.Rendering
Metro.Controller.include Metro.Controller.Resources
Metro.Controller.include Metro.Controller.Responding
Metro.Controller.include Metro.Controller.Sockets

module.exports = Metro.Controller
