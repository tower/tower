require './shared'

unless Tower.isNew
  require './shared/number'
  require './shared/geo'

require './shared/callbacks'
require './shared/shared'
require './shared/class'

unless Tower.isNew
  require './shared/eventEmitter'
  require './shared/i18n'
  require './shared/url'
  require './shared/locale/en'
  require './shared/format'
  require './shared/factory'

unless Tower.isNew
  _path = require('path')

  # @todo tmp hack
  require('pathfinder').File.glob = ->
    paths   = Array.prototype.slice.call(arguments, 0, arguments.length)
    result  = []
    for path in paths
      if @exists(path)
        found = require('wrench').readdirSyncRecursive(path)
        for item, index in found
          result.push(path + _path.sep + item)
    result