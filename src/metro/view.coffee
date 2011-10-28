_ = require 'underscore'

class View
  @Helpers:       require './view/helpers'
  @Lookup:        require './view/lookup'
  @Rendering:     require './view/rendering'
  
  @include @Rendering
  
  @initialize: ->
    @resolve_load_paths()
    @resolve_template_paths()
    Metro.Support.Dependencies.load("#{Metro.root}/app/helpers")
    
  @teardown: ->
  
  @resolve_load_paths: ->
    file = Metro.Support.Path
    @load_paths = _.map @load_paths, (path) -> file.expand_path(path)
    
  @lookup: (view) ->  
    paths_by_name = Metro.View.paths_by_name
    result    = paths_by_name[view]
    return result if result
    templates = Metro.View.paths
    pattern   = new RegExp(view + "$", "i")
    
    for template in templates
      if template.split(".")[0].match(pattern)
        paths_by_name[view] = template
        return template
        
    return null
  
  @resolve_template_paths: ->
    file           = require("file")
    template_paths = @paths
    
    for path in Metro.View.load_paths
      file.walkSync path, (_path, _directories, _files) ->
        for _file in _files
          template = [_path, _file].join("/")
          template_paths.push template if template_paths.indexOf(template) == -1      
    
    template_paths
  
  @load_paths:               ["./spec/spec-app/app/views"]
  @paths:         []
  @paths_by_name: {}
  @engine: "jade"
  @pretty_print:   false
  
  constructor: (controller) ->
    @controller = controller || (new Metro.Controller)
  
module.exports = View
