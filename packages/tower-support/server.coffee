require './shared'

# @todo tmp hack
require('pathfinder').File.glob = ->
  paths   = Array.prototype.slice.call(arguments, 0, arguments.length)
  result  = []
  for path in paths
    if @exists(path)
      found = require('wrench').readdirSyncRecursive(path)
      for item, index in found
        result.push(path + '/' + item)
  result