fs     = require('fs')
Metro  = require('./lib/metro')
yui    = new Metro.Asset.YUICompressor
uglify = new Metro.Asset.UglifyJSCompressor
file   = require("./node_modules/file")
{print} = require 'sys'
{spawn} = require 'child_process'

task 'compress', ->
  src = ''
  min = ''
  file.walkSync "./lib", (dirPath, dirs, files) ->
    for file in files
      data = fs.readFileSync [dirPath, file].join("/"), 'utf8'
      src = src + data + '\n'
      min = min + uglify.compress(data)
  #fs.writeFileSync "metro.js", src
  fs.writeFileSync "metro.min.js", min

build = (callback) ->
  coffee = spawn 'coffee', ['-c', '-o', 'lib', 'src']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
  coffee.on 'exit', (code) ->
    callback?() if code is 0

task 'build', 'Build lib/ from src/', ->
  build()
  