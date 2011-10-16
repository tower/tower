_ = require("underscore")

Views =
  Base:     require('./views/base')
  Template: require('./views/template')
  
  bootstrap: ->
    @resolve_load_paths()
    @resolve_template_paths()
    
  resolve_load_paths: ->
    file = Metro.Assets.File
    @load_paths = _.map @load_paths, (path) -> file.expand_path(path)
    
  resolve_template_paths: ->
    file           = require("file")
    template_paths = @template_paths
    
    for path in @load_paths
      file.walkSync path, (_path, _directories, _files) ->
        for _file in _files
          template = [_path, _file].join("/")
          template_paths.push template if template_paths.indexOf(template) == -1
          
    @template_paths
    
  load_paths:               ["./spec/spec-app/app/views"]
  template_paths_by_name:   {}
  template_paths:           []

module.exports = Views
