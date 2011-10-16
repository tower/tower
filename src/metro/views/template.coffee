fs = require("fs")
_ = require("underscore")

class Template
  render: (view, options) ->
    engine = Metro.Compilers.engines()[options.type]
    engine = new engine
    engine.compile("#{view}.#{options.type}")
    
  lookup: (view) ->
    result = Metro.Views.template_paths_by_name[view]
    return result if result
    templates  = Metro.Views.template_paths
    pattern = new RegExp(view + "$", "i")
    
    for template in templates
      if template.split(".")[0].match(pattern)
        Metro.Views.template_paths_by_name[view] = template
        return template
        
    return null
    
module.exports = Template
