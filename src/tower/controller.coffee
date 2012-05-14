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
  @reopenClass Tower.Support.EventEmitter
  @include  Tower.Support.EventEmitter
  
  if Tower.isClient
    @extended: ->
      object  = {}
      name    = @className()
    
      object[Tower.Support.String.camelize(name, true)] = Ember.computed(->
        Tower.namespace()[name].create()
      ).cacheable()
    
      Tower.namespace().reopen(object)
  
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

    @formats              = _.keys(metadata.mimes)
    @hasParent            = @constructor.hasParent()

require './controller/callbacks'
require './controller/errors'
require './controller/helpers'
require './controller/instrumentation'
require './controller/metadata'
require './controller/params'
require './controller/redirecting'
require './controller/rendering'
require './controller/resourceful'
require './controller/responder'
require './controller/responding'

Tower.Controller.include Tower.Controller.Callbacks
Tower.Controller.include Tower.Controller.Errors
Tower.Controller.include Tower.Controller.Helpers
Tower.Controller.include Tower.Controller.Instrumentation
Tower.Controller.include Tower.Controller.Metadata
Tower.Controller.include Tower.Controller.Params
Tower.Controller.include Tower.Controller.Redirecting
Tower.Controller.include Tower.Controller.Rendering
Tower.Controller.include Tower.Controller.Resourceful
Tower.Controller.include Tower.Controller.Responding

module.exports = Tower.Controller
