_ = require("underscore")
_.mixin(require("underscore.string"))

Support =
  Class:    require('./support/class')
  Logger:   require('./support/logger')
  
  ###
  Metro.watch "./assets/javascripts", -> Metro.Asset.compile()
    
  Metro.watch "./app/models", (path) -> Metro.Spec.run(path)
  ###
  watch: (paths, callback) ->
    paths = Array(paths)
    
  load_classes: (directory) ->
    files = require('findit').sync directory
    for file in files
      klass = Metro.Assets.File.basename(file).split(".")[0]
      klass = _.camelize("_#{klass}")
      global[klass] = require(file)
    
exports = module.exports = Support
