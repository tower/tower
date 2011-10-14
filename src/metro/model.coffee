_ = require("underscore")
_.mixin(require("underscore.string"))

class Model extends Class
  @bootstrap: ->
    files = require('findit').sync "#{Metro.root}/app/models"
    for file in files
      klass = Metro.Asset.File.basename(file).split(".")[0]
      klass = _.camelize("_#{klass}")
      global[klass] = require(file)

exports = module.exports = Model
