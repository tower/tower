# maybe switch to makefile, such as https://github.com/michaelficarra/CoffeeScriptRedux/blob/master/Makefile
fs      = require 'fs'
findit  = require './node_modules/findit'
async   = require './node_modules/async'
mint    = require 'mint'
gzip    = require 'gzip'
_path   = require 'path'
File    = require('pathfinder').File
{exec, spawn}  = require 'child_process'
sys     = require 'util'
require 'underscore.logger'

VERSION       = JSON.parse(require("fs").readFileSync(require("path").normalize("#{__dirname}/package.json"))).version
DATE          = (new Date).toUTCString()
JS_COPYRIGHT  = """
/*!
 * Tower.js v#{VERSION}
 * http://towerjs.org/
 *
 * Copyright 2012, Lance Pollard
 * MIT License.
 * http://towerjs.org/license
 *
 * Date: #{DATE}
 */

"""

compileFile = (root, path, check) ->
  try
    data = fs.readFileSync path, 'utf-8'
    # total hack, built 10 minutes at a time over a few months, needs to be rethought, but works
    data = data.replace /require '([^']+)'\n/g, (_, _path) ->
      #_path = "#{root}/#{_path.toString().split("/")[2]}.coffee"
      parts = _path.toString().split("/")
      if parts.length > 2
        if parts[1] == "client"
          parts = parts[1..-1]
        else
          parts = parts[2..-1]
      else
        parts = parts[1..-1]
      _path = "#{root}/#{parts.join("/")}.coffee"
      if !check || check(_path)
        #fs.readFileSync _path, 'utf-8'
        _root = _path.split(".")[-3..-2].join(".")
        #_root = _path.replace(/\.coffee$/, "")
        try
          compileFile(_root, _path, check) + "\n\n"
        catch error
          _console.info _path
          _console.error error.stack
          ""
      else
        ""
    data = data.replace(/module\.exports\s*=.*\s*/g, "")
    data + "\n\n"
  catch error
    console.log error
    ""

compileDirectory = (root, check, callback) ->
  code = compileFile("./src/tower/#{root}", "./src/tower/#{root}.coffee", check)
  callback(code) if callback
  code

compileEach = (root, check, callback) ->
  result = compileDirectory root, check, callback

  #fs.writeFile "./dist/tower/#{root}.coffee", result
  mint.coffee result, bare: false, (error, result) ->
    fs.writeFile "./dist/tower/#{root}.js", result
    unless error
      fs.writeFile "./dist/tower/#{root}.min.js", mint.uglifyjs(result, {})

task 'build', ->
  content = compileFile("./src/tower", "./src/tower/client.coffee").replace /Tower\.version *= *.+\n/g, (_) ->
    version = """
Tower.version = "#{VERSION}"

"""
  fs.writeFileSync './dist/tower.coffee', content
  mint.coffee content, bare: false, (error, result) ->
    result = JS_COPYRIGHT + result
    _console.error error.stack if error
    fs.writeFileSync "./dist/tower.js", result
    fs.writeFileSync './test/example/public/javascripts/vendor/javascripts/tower.js', result
    return
    unless error
      #result = obscurify(result)

      mint.uglifyjs result, {}, (error, result) ->
        fs.writeFileSync("./dist/tower.min.js", result)

        gzip result, (error, result) ->

          fs.writeFileSync("./dist/tower.min.js.gz", result)

          console.log "Minified & Gzipped: #{fs.statSync("./dist/tower.min.js.gz").size}"

          fs.writeFile "./dist/tower.min.js.gz", mint.uglifyjs(result, {})

task 'clean', 'remove trailing whitespace', ->
  findit.find "./packages", (file) ->
    if !file.match('command') && File.isFile(file)
      fs.writeFileSync(file, fs.readFileSync(file, "utf-8").toString().replace(/[ \t]+$/mg, ""))