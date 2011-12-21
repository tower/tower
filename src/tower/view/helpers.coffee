Tower.View.Helpers =
  titleTag: (title) ->
    "<title>#{title}</title>"
  
  metaTag: (name, content) ->
    """<meta name="#{name}" content="#{content}"/>"""
  
  tag: (name, options) ->
    
  linkTag: (title, path, options) ->
    
  imageTag: (path, options) ->
    
  csrfMetaTag: ->
    @metaTag("csrf-token", @request.session._csrf)
  
  contentTypeTag: (type = "UTF-8") ->
    "<meta charset=\"#{type}\" />"

  javascriptTag: (path) ->
    "<script type=\"text/javascript\" src=\"#{path}\" ></script>"

  stylesheetTag: (path) ->
    "<link href=\"#{path}\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\"/>"

  javascripts: (source) ->
    if Tower.env == "production"
      manifest  = Tower.assetManifest
      source    = "#{source}.js"
      source    = manifest[source] if manifest[source]
      path      = "/javascripts/#{source}"
      path      = "#{Tower.assetHost}#{path}" if Tower.assetHost
      @javascriptTag(path)
    else
      paths   = Tower.assets.javascripts[source]
      result  = []
      for path in paths
        result.push @javascriptTag("/javascripts#{path}.js")
      result.join("")

  stylesheets: (source) ->
    if Tower.env == "production"
      manifest  = Tower.assetManifest
      source    = "#{source}.css"
      source    = manifest[source] if manifest[source]
      path      = "/stylesheets/#{source}"
      path      = "#{Tower.assetHost}#{path}" if Tower.assetHost
      @stylesheetTag(path)
    else
      paths   = Tower.assets.stylesheets[source]
      result  = []
      for path in paths
        result.push @stylesheetTag("/stylesheets#{path}.css")
      result.join("")
  
  t: (string) ->
    Tower.translate(string)
  
  l: (object) ->
    Tower.localize(string)
    
module.exports = Tower.View.Helpers
