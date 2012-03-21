class Tower.Application.Configuration extends Tower.Class
  @include Tower.Support.Callbacks

  @before "initialize", "addLoadPaths"
  @before "initialize", "addAutoloadPaths"
  @before "initialize", "addRoutingPaths"
  @before "initialize", "addLocalePaths"
  @before "initialize", "addViewPaths"
  @before "initialize", "addHelperPaths"
  @before "initialize", "addAssetPaths"
  @before "initialize", "addConfigPaths"
  @before "initialize", "loadInitializers"

  addRoutingPaths: ->
    for key in @constructor.configNames
      config = null

      try
        config  = require("#{Tower.root}/config/#{key}")
      catch error
        config  = {}

      Tower.config[key] = config if Tower.Support.Object.isPresent(config)

    Tower.Application.Assets.loadManifest()

    paths = File.files("#{Tower.root}/config/locales")
    for path in paths
      Tower.Support.I18n.load(path) if path.match(/\.(coffee|js)$/)

    # load initializers
    require "#{Tower.root}/config/environments/#{Tower.env}"

    paths = File.files("#{Tower.root}/config/initializers")

    for path in paths
      require(path) if path.match(/\.(coffee|js)$/)

    configs = @constructor.initializers()

    config.call(@) for config in configs

    paths = File.files("#{Tower.root}/app/helpers")
    paths = paths.concat File.files("#{Tower.root}/app/models")
    paths = paths.concat ["#{Tower.root}/app/controllers/applicationController"]
    for path in ["controllers", "mailers", "observers", "presenters", "middleware"]
      paths = paths.concat File.files("#{Tower.root}/app/#{path}")

    for path in paths
      require(path) if path.match(/\.(coffee|js)$/)
