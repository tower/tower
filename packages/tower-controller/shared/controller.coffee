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
class Tower.Controller extends Tower.Collection
  @include  Tower.Support.Callbacks
  @reopenClass Tower.Support.EventEmitter
  @include  Tower.Support.EventEmitter

  @instance: ->
    @_instance ||= new @

  init: ->
    @_super arguments...
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

    @formats              = if Tower.isClient then ['html'] else _.keys(metadata.mimes)
    @hasParent            = @constructor.hasParent()

module.exports = Tower.Controller
