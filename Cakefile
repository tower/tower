fs      = require('fs')
findit  = require('./node_modules/findit')
async   = require './node_modules/async'
Shift   = require './node_modules/shift'
engine  = new Shift.CoffeeScript
{exec} = require 'child_process'

task 'build', ->
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
  
task 'docs', 'Build the docs'

task 'site', 'Build site'

task 'stats', 'Build files and report on their sizes'