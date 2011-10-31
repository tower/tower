fs      = require('fs')
findit  = require('./node_modules/findit')
async   = require './node_modules/async'
Shift   = require './node_modules/shift'
engine  = new Shift.CoffeeScript
{exec}  = require 'child_process'

Metro   = require './lib/metro'
compressor = new Shift.UglifyJS

compileDirectory = (root, check, callback) ->
  code = ''
  path = "./src/metro/#{root}.coffee"
  data = fs.readFileSync path, 'utf-8'
  data = data.replace /require '([^']+)'\n/g, (_, _path) ->
    _path = "./src/metro/#{root}/#{_path.toString().split("/")[2]}.coffee"
    if !check || check(_path)
      fs.readFileSync _path, 'utf-8'
    else
      ""
  
  data = data.replace(/module\.exports\s*=.*\s*/g, "")
  code += data# + "\n"
  
  callback(code) if callback
  
  code
  
compileEach = (root, check, callback) ->
  result = compileDirectory root, check, callback
  
  #fs.writeFile "./dist/metro/#{root}.coffee", result
  engine.render result, bare: false, (error, result) ->
    fs.writeFile "./dist/metro/#{root}.js", result
    unless error
      fs.writeFile "./dist/metro/#{root}.min.js", compressor.render(result)

task 'build', ->  
  # models
  result = ''
  
  compileEach 'model', null, (code) ->
    result += code
    compileEach 'view', null, (code) ->
      result += code
      compileEach 'controller', null, (code) ->
        result += code
        compileEach 'route', null, (code) ->
          result += code
          compileEach 'store', ((path) -> !!path.match('memory')), (code) ->
            result += code
            
            engine.render result, bare: false, (error, result) ->
              fs.writeFile "./dist/metro.js", result
              unless error
                fs.writeFile "./dist/metro.min.js", compressor.render(result)
            

task 'build-generic', ->
  paths   = findit.sync('./src')
  result  = ''
  
  iterate = (path, next) ->
    if path.match(/\.coffee$/) && !path.match(/(middleware|application|generator|asset|command|spec|store|path)/)
      fs.readFile path, 'utf-8', (error, data) ->
        if !data || data.match(/Bud1/)
          console.log path
        else
          data = data.replace(/module\.exports\s*=.*\s*/g, "")
          result += data + "\n"
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

task 'clean', 'Remove built files in ./dist', ->

task 'spec', 'Run jasmine specs', ->
  exec './node_modules/jasmine-node/bin/jasmine-node --coffee ./spec', (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr
  
task 'coffee', 'Auto compile src/**/*.coffee files into lib/**/*.js', ->
  exec './node_modules/coffee-script/bin/coffee -o lib -w src', (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr
  
task 'docs', 'Build the docs', ->
  exec './node_modules/dox/bin/dox < ./lib/metro/route/dsl.js', (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr

task 'site', 'Build site'

task 'stats', 'Build files and report on their sizes', ->
  Table = require './node_modules/cli-table'
  paths = findit.sync('./dist')
  prev  = 0
  table = new Table
    head:       ['Path', 'Size (kb)', 'Compression (%)']
    colWidths:  [50, 15, 20]
  
  for path, i in paths
    if path.match(/\.(js|coffee)$/)
      stat = fs.statSync(path)
      size = stat.size / 1000.0
      if i % 2 == 0
        percent = (size / prev) * 100.0
        percent = percent.toFixed(1)
        table.push [path, size, "#{percent} %"]
      table.push [path, size, "-"]
      prev = size
      
  console.log table.toString()