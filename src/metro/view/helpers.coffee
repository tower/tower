class Metro.View.Helpers
  #["form", "table"].each ->
  #  klass = "Metro.Components.#{this.toUpperCase()}"
  #  @::["#{this}_for"] = -> global[klass].new(arguments...).render()
    
  stylesheetLinkTag: (source) ->
    "<link href=\"#{@assetPath(source, directory: Metro.Assets.stylesheetDirectory, ext: "css")}\"></link>"
    
  assetPath: (source, options = {}) ->
    if options.digest == undefined
      options.digest = !!Metro.env.match(/(development|test)/) 
    Metro.Application.assets().computePublicPath(source, options)
    
  javascriptIncludeTag: (path) ->
    
  titleTag: (title) ->
    "<title>#{title}</title>"
    
  metaTag: (name, content) ->
    
  tag: (name, options) ->
  
  linkTag: (title, path, options) ->
    
  imageTag: (path, options) ->
    
module.exports = Metro.View.Helpers
