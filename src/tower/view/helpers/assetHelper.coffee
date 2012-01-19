Tower.View.AssetHelper =  
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

module.exports = Tower.View.AssetHelper