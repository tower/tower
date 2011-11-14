class Metro.View.Helpers
  #["form", "table"].each ->
  #  klass = "Metro.Components.#{this.toUpperCase()}"
  #  @::["#{this}_for"] = -> global[klass].new(arguments...).render()
    
  contentTypeTag: (type = "UTF-8") ->
    "\n    <meta charset=\"#{type}\" />"
  
  t: (string) ->
    @_t ?= require("#{Metro.root}/config/locales/en")
    @_t[string]
    
  stylesheetTag: (source) ->
    paths   = @assetPaths(source, directory: Metro.Asset.config.stylesheetDirectory, extension: ".css")
    result  = []
    for path in paths
      result.push "\n    <link href=\"#{path}\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\"/>"
    result.join("")
    
  javascriptTag: (source) ->
    paths   = @assetPaths(source, directory: Metro.Asset.config.javascriptDirectory, extension: ".js")
    result  = []
    for path in paths
      result.push "\n    <script type=\"text/javascript\" src=\"#{path}\" ></script>"
    result.join("")
    
  assetPaths: (source, options = {}) ->
    options.digest  = false#!(!!Metro.env.match(/(development|test)/)) unless options.hasOwnProperty("digest")
    env             = Metro.Asset
    publicPath      = env.computePublicPath(source, options)
    
    return [publicPath] if Metro.env == "production" || Metro.Support.Path.isUrl(publicPath)
    
    self            = @
    asset           = env.find(publicPath)
    
    # Metro.throw("errors.notFound", "Asset with path '#{publicPath}'") unless asset
    
    result    = []
    
    asset.paths paths: env.pathsFor(asset.extension), require: Metro.env != "production", (paths) ->
      for path, i in paths
        path = source if i == paths.length - 1
        result.push env.computePublicPath(path, options)
    
    result
    
  titleTag: (title) ->
    "<title>#{title}</title>"
    
  metaTag: (name, content) ->
    
  tag: (name, options) ->
  
  linkTag: (title, path, options) ->
    
  imageTag: (path, options) ->
    
module.exports = Metro.View.Helpers
