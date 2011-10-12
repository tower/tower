fs     = require('fs')
Metro  = require('./lib/metro')
yui    = new Metro.Asset.YUICompressor
uglify = new Metro.Asset.UglifyJSCompressor
file   = require("./node_modules/file")

task 'build', ->
  src = ''
  min = ''
  file.walkSync "./lib", (dirPath, dirs, files) ->
    for file in files
      data = fs.readFileSync [dirPath, file].join("/"), 'utf8'
      src = src + data
      min = min + uglify.compress(data)
  fs.writeFileSync "metro.js", src
  fs.writeFileSync "metro.min.js", min
