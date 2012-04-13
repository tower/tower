wrench  = require 'wrench'
fs      = require 'fs'

Tower.Support.File =
  removeDirectory: (path, recursive = true) ->
    if recursive
      wrench.rmdirSyncRecursive(path)
    else
      fs.rmdirSync(path)