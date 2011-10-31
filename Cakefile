fs      = require('fs')
#Metro  = require('./lib/metro')
_       = require('./node_modules/underscore')
findit  = require('./node_modules/findit')
_path   = require 'path'
async   = require './node_modules/async'
Shift   = require './node_modules/shift'
engine  = new Shift.CoffeeScript

task 'compile-client', ->
  paths   = findit.sync('./src')
  result  = ''
  
  iterate = (path, next) ->
    if path.match(/\.coffee$/)
      fs.readFile path, 'utf-8', (error, data) ->
        if !data || data.match(/Bud1/)
          console.log path
        else
          result += data + "\n\n\n"
        next()
    else
      next()

  async.forEachSeries paths, iterate, ->
    fs.writeFile './dist/metro.coffee', result
    engine.render result, (error, result) ->
      console.log error
      fs.writeFile './dist/metro.js', result
      unless error
        compressor = new Shift.UglifyJS
        fs.writeFile './dist/metro.min.js', compressor.render(result)
        #compressor.render result, (error, result) ->
        #  console.log error
        #  fs.writeFile './dist/metro.min.js', result

###
task 'compile', 'Builds Metro for the browser, removing the server-side specific code, and injecting required code into one file!', ->
  burrito = require('burrito')
  find    = (path, callback) ->
    burrito fs.readFileSync(path), (node) ->
      isRequire = node.name is "call" and node.value[0][0] is "name" and node.value[0][1] is "require"
      
      if isRequire
        expr = node.value[1][0]
        if expr[0].name is "string"
          modules.strings.push expr[1]
        else
          modules.expressions.push burrito.deparse(expr)
          
      isDotRequire = (node.name is "dot" or node.name is "call") and node.value[0][0] is "call" and node.value[0][1][0] is "name" and node.value[0][1][1] is "require"
      
      if isDotRequire
        expr = node.value[0][2][0]
        if expr[0].name is "string"
          modules.strings.push expr[1]
        else
          modules.expressions.push burrito.deparse(expr)
          
      isDotCallRequire = node.name is "call" and node.value[0][0] is "dot" and node.value[0][1][0] is "call" and node.value[0][1][1][0] is "name" and node.value[0][1][1][1] is "require"
      
      if isDotCallRequire
        expr = node.value[0][1][2][0]
        if expr[0].name is "string"
          modules.strings.push expr[1]
        else
          modules.expressions.push burrito.deparse(expr)
  
  # https://github.com/substack/node-detective/blob/master/index.js
  output  = find "./lib/metro.js", (path, className) ->
    if className in ["Controller", "Model", "Route", "Store", "View"]
      find path, (subPath, subClassName) ->
        if className == "Controller" and subClassName in ["Configuration", "Flash", "Rendering"]
          find subPath
        else if className == "Model" and subClassName in ["Association", "Associations", "Attributes"]
          find subPath

task 'compile_test', ->
  burrito = require('burrito')
  
  # https://github.com/substack/node-detective/blob/master/index.js
  input = 'Metro.Console = require("foo"); var require = function() {alert("!")}'
  output = burrito input, (node) ->
    console.log node.label() + " " + node.name
    if (node.name === 'call') node.wrap('LANCE')
  
  require('sys').puts(output)
###