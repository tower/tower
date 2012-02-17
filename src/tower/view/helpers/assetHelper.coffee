Tower.View.AssetHelper =  
  javascripts: (sources...) ->
    options = Tower.Support.Array.extractOptions(sources)
    options.namespace = "javascripts"
    options.extension = "js"
    paths = _extractAssetPaths sources, options
    javascriptTag(path) for path in paths
    return null
    
  javascript: ->
    javascript.apply @, arguments

  stylesheets: (sources...) ->
    options = Tower.Support.Array.extractOptions(sources)
    options.namespace = "stylesheets"
    options.extension = "css"
    paths = _extractAssetPaths sources, options
    stylesheetTag(path) for path in paths
    return null
      
  stylesheet: ->
    stylesheets.apply @, arguments
    
  _extractAssetPaths: (sources, options = {}) ->
    namespace = options.namespace
    extension = options.extension
    result    = []
    
    if Tower.env == "production"
      manifest  = Tower.assetManifest
      for source in sources
        unless !!source.match(/^(http|\/{2})/)
          source    = "#{source}.#{extension}"
          source    = manifest[source] if manifest[source]
          source    = "/assets/#{source}"
          source    = "#{Tower.assetHost}#{source}" if Tower.assetHost
        result.push(source)
    else
      for source in sources
        if !!source.match(/^(http|\/{2})/)
          result.push(source)
        else
          paths   = Tower.config.assets[namespace][source]
          if paths
            for path in paths
              result.push("/#{namespace}#{path}.#{extension}")
    
    result
      
  stylesheetTag: (source) ->
    link rel: 'stylesheet', href: source
    
  javascriptTag: (source) ->
    script src: source

module.exports = Tower.View.AssetHelper