Path = require('pathfinder').File

class Metro.View.Lookup
  @initialize: ->
    @resolveLoadPaths()
    @resolveTemplatePaths()
    Metro.Support.Dependencies.load("#{Metro.root}/app/helpers")
    
  @teardown: ->
  
  @resolveLoadPaths: ->
    file = Path
    @loadPaths = _.map @loadPaths, (path) -> Path.relativePath(path)
    
  @lookup: (view) ->  
    pathsByName = Metro.View.pathsByName
    result    = pathsByName[view]
    return result if result
    templates = Metro.View.paths
    pattern   = new RegExp(view + "$", "i")
    
    for template in templates
      dirname   = Path.dirname(template)
      basename  = Path.basename(template).split(".")[0]
      key       = "#{dirname}/#{basename}"
      if key.match(pattern)
        pathsByName[view] = template
        return template
        
    return null
  
  @resolveTemplatePaths: ->
    file            = require("file")
    templatePaths   = @paths
    
    for path in Metro.View.loadPaths
      file.walkSync path, (_path, _directories, _files) ->
        for _file in _files
          template = [_path, _file].join("/")
          templatePaths.push template if templatePaths.indexOf(template) == -1      
    
    templatePaths
  
  @loadPaths:       ["./app/views"]
  @paths:           []
  @pathsByName:     {}
  @engine:          "jade"
  @prettyPrint:     false

module.exports = Metro.View.Lookup
