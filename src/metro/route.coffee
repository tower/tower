require './support/class'

class Route extends Class
  @Collection:              require('./route/collection')
  @Mapper:                  require('./route/mapper')
  
  @ANCHOR_CHARACTERS_REGEX: /\A(\\A|\^)|(\\Z|\\z|\$)\Z/
  @SHORTHAND_REGEX:         /[\w/]+$/
  @WILDCARD_PATH:           /\*([^/\)]+)\)?$/
  
  @include @Mapper
  
  @bootstrap: ->
    require("#{Metro.root}/config/routes.js")
  
  app:      null
  name:     null
  path:     null
  verb:     null
  defaults: {}
  ip:       null
  
  constructor: (path, scope, defaults, name) ->
    @name       = name
    @path       = @build_path(path)
    @scope      = scope
    @options    = scope.options || {}
    @verb       = scope.request_method || //
    @ip         = scope.ip || //
  
  to: ->
    @options.to
    
  default_controller: ->
    @options.controller || @scope.controller
  
  default_action: ->
    @options.action || @scope.action
  
  build_path: (path) ->
    "#{path}(.:format)"
    
Metro =
  Route: Route

exports = module.exports = Metro
