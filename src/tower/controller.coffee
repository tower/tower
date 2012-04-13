# @include Tower.Support.Callbacks
# @include Tower.Support.EventEmitter
# @include Tower.Controller.Callbacks
# @include Tower.Controller.Helpers
# @include Tower.Controller.Instrumentation
# @include Tower.Controller.Params
# @include Tower.Controller.Redirecting
# @include Tower.Controller.Rendering
# @include Tower.Controller.Resourceful
# @include Tower.Controller.Responding
class Tower.Controller extends Tower.Class
  @include  Tower.Support.Callbacks
  @extend   Tower.Support.EventEmitter
  @include  Tower.Support.EventEmitter

  @instance: ->
    @_instance ||= new @

  constructor: ->
    @constructor._instance = @
    @headers              = {}
    @status               = 200
    @request              = null
    @response             = null
    @params               = {}
    @query                = {}

    metadata              = @constructor.metadata()

    @resourceName         = metadata.resourceName
    @resourceType         = metadata.resourceType
    @collectionName       = metadata.collectionName

    @formats              = _.keys(metadata.mimes)
    @hasParent            = @constructor.hasParent()

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

module.exports = Tower.Controller
