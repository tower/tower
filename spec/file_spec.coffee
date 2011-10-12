Metro  = require('../lib/metro')
yui    = new Metro.Asset.YuiCompressor
uglifier = new Metro.Asset.UglifierCompressor
fs     = require('fs')
file   = require("file")

describe "file", ->
  it "should read files", ->
    javascript = ''
    file.walkSync "./lib/asset", (dirPath, dirs, files) ->
      for file in files
        data = fs.readFileSync [dirPath, file].join("/"), 'utf8'
        javascript = javascript + uglifier.compress(data.toString()) + ';'
