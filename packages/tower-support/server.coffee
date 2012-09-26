require './shared'
_path = require('path')
Tower.Support.on_load = require('node-obj-watch').on_load

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