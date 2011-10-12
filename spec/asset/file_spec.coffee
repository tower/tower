Metro  = require('../../lib/metro')
yui    = new Metro.Asset.YUICompressor
uglify = new Metro.Asset.UglifyJSCompressor
fs     = require('fs')
file   = require("file")

describe "file", ->
  it "should read files", ->
    javascript = ''
    file.walkSync "./lib/asset", (dirPath, dirs, files) ->
      for file in files
        data = fs.readFileSync [dirPath, file].join("/"), 'utf8'
        javascript = javascript + uglify.compress(data.toString()) + ';'
    console.log javascript
