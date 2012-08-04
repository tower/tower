# maybe switch to makefile, such as https://github.com/michaelficarra/CoffeeScriptRedux/blob/master/Makefile
fs      = require 'fs'
findit  = require './node_modules/findit'
async   = require './node_modules/async'
mint    = require 'mint'
gzip    = require 'gzip'
nodePath = require 'path'
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

compileFile = (root, path, level) ->
  try
    data = fs.readFileSync path, 'utf-8'
    # total hack, built 10 minutes at a time over a few months, needs to be rethought, but works
    data = data.replace /require '([^']+)'\n/g, (_, _path) ->
      _parent = !!_path.match(/\.\./)
      if _parent
        _root = nodePath.resolve(root, _path)
        _path = _root + '.coffee'
      else
        _root = nodePath.resolve(root, '..', _path)
        _path = _root + '.coffee'
      try
        compileFile(_root, _path, level + 1) + "\n\n"
      catch error
        _console.info _path
        _console.error error.stack
        ""
    data = data.replace(/module\.exports\s*=.*\s*/g, "")
    data + "\n\n"
    if level == 1
      outputPath = './dist/' + nodePath.resolve(path, '..').split('/').pop()
      fs.writeFileSync outputPath + '.coffee', data
      mint.coffee data, bare: false, (error, result) ->
        # result = JS_COPYRIGHT + result
        _console.error error.stack if error
        fs.writeFileSync outputPath + '.js', result
    data
  catch error
    console.log error
    ""

task 'build', ->
  fs.mkdirSync('./dist')
  content = compileFile("./packages/tower", "./packages/tower/client.coffee", 0).replace /Tower\.version *= *.+\n/g, (_) ->
    version = """
Tower.version = "#{VERSION}"

"""
  fs.writeFileSync './dist/tower.coffee', content
  mint.coffee content, bare: false, (error, result) ->
    result = JS_COPYRIGHT + result
    _console.error error.stack if error
    fs.writeFileSync "./dist/tower.js", result
    #fs.writeFileSync './test/example/public/javascripts/vendor/javascripts/tower.js', result
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