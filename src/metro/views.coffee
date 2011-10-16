_ = require("underscore")

Views =
  Base:     require('./views/base')
  Helpers:  require('./views/helpers')
  
  bootstrap: ->
    @resolve_load_paths()
    @resolve_template_paths()
    
  resolve_load_paths: ->
    file = Metro.Assets.File
    @load_paths = _.map @load_paths, (path) -> file.expand_path(path)
    
  lookup: (view) ->  
    paths_by_name = Metro.Views.paths_by_name
    result    = paths_by_name[view]
    return result if result
    templates = Metro.Views.paths
    pattern   = new RegExp(view + "$", "i")
    
    for template in templates
      if template.split(".")[0].match(pattern)
        paths_by_name[view] = template
        return template
        
    return null
  
  resolve_template_paths: ->
    file           = require("file")
    template_paths = @paths
    
    for path in Metro.Views.load_paths
      file.walkSync path, (_path, _directories, _files) ->
        for _file in _files
          template = [_path, _file].join("/")
          template_paths.push template if template_paths.indexOf(template) == -1      
    
    template_paths
  
  load_paths:               ["./spec/spec-app/app/views"]
  paths:         []
  paths_by_name: {}
  engine: "jade"
  
  engines: ->
    @_engines ?= {
      "stylus":   Metro.Compilers.Stylus
      "jade":     Metro.Compilers.Jade
      "haml":     Metro.Compilers.Haml
      "ejs":      Metro.Compilers.Ejs
      "coffee":   Metro.Compilers.CoffeeScript
      "less":     Metro.Compilers.Less
      #"scss":    Metro.Compilers.Scss
      "sass":     Metro.Compilers.Sass
      "mustache": Metro.Compilers.Mustache
    }


module.exports = Views
