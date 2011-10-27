fs     = require('fs')
watch  = require('./node_modules/watch')
Metro  = require('./lib/metro')
_      = require('./node_modules/underscore')

Metro.configure ->
  @assets.path            = "./spec/tmp/assets"
  @assets.css_compressor  = "yui"
  @assets.js_compressor   = "uglifier"
  @assets.js              = ["application.js"]
  @assets.js_paths        = ["./spec/fixtures"]
  
task 'watch', ->
  watch.watchTree './spec/fixtures', (f, curr, prev) ->
    if typeof f == "object" && prev == null && curr == null
      #Finished walking the tree
      console.log "walked"
      @
    else if prev == null
      # f is a new file
      console.log "new"
      @
    else if curr.nlink == 0
      # f was removed
      console.log "removed"
      @
    else
      # f was changed
      console.log "changed"
      Metro.Asset.compile()
      @
    # console.log curr
    
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
