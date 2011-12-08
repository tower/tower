Metro.View.Helpers =
  contentTypeTag: (type = "UTF-8") ->
    "\n    <meta charset=\"#{type}\" />"
  
  t: (string) ->
    Metro.translate(string)
  
  javascriptTag: (path) ->
    "\n    <script type=\"text/javascript\" src=\"#{path}\" ></script>"
  
  stylesheetTag: (path) ->
    "\n    <link href=\"#{path}\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\"/>"
    
  javascripts: (source) ->
    if Metro.env == "production"
      manifest  = Metro.assetManifest
      source    = "#{source}.js"
      source    = manifest[source] if manifest[source]
      path      = "/javascripts/#{source}"
      path      = "#{Metro.assetHost}#{path}" if Metro.assetHost
      @javascriptTag(path)
    else
      paths   = Metro.assets.javascripts[source]
      result  = []
      for path in paths
        result.push @javascriptTag("/javascripts#{path}.js")
      result.join("")
  
  stylesheets: (source) ->
    if Metro.env == "production"
      manifest  = Metro.assetManifest
      source    = "#{source}.css"
      source    = manifest[source] if manifest[source]
      path      = "/stylesheets/#{source}"
      path      = "#{Metro.assetHost}#{path}" if Metro.assetHost
      @stylesheetTag(path)
    else
      paths   = Metro.assets.stylesheets[source]
      result  = []
      for path in paths
        result.push @stylesheetTag("/stylesheets#{path}.css")
      result.join("")
    
  titleTag: (title) ->
    "<title>#{title}</title>"
    
  metaTag: (name, content) ->
    
  tag: (name, options) ->
  
  linkTag: (title, path, options) ->
    
  imageTag: (path, options) ->
    
module.exports = Metro.View.Helpers
