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

#Tower   = require './lib/tower'

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

obscurify = (content) ->
  replacements = {}
  replacements[process.env.NS || "Tower"] = "Tower" # use "M" for ultimate compression
  replacements["_C"]  = "ClassMethods"
  replacements["_I"]  = "InstanceMethods"
  replacements["_"]   = /Tower\.Support\.(String|Object|Number|Array|RegExp)/

  for replacement, lookup of replacements
    content = content.replace(lookup, replacement)

  content

task 'to-underscore', ->
  _modules  = ["string", "object", "number", "array", "regexp"]
  result    = "_.mixin\n"

  for _module in _modules
    content = fs.readFileSync("./src/tower/support/#{_module}.coffee", "utf-8") + "\n"
    content = content.replace(/Tower\.Support\.\w+\ *=\ */g, "")
    result += content

  path  = "dist/tower.support.underscore.js"
  sizes = []

  result = obscurify(result)

  mint.coffee result, {}, (error, result) ->
    return console.log(error) if error

    fs.writeFileSync(path, result)

    sizes.push "Normal: #{fs.statSync(path).size}"
    exec "mate #{path}"
    #compressor = new Shift.UglifyJS
    #
    #compressor.render result, (error, result) ->
    #  fs.writeFileSync(path, result)
    #
    #  sizes.push "Minfied: #{fs.statSync(path).size}"

      #gzip result, (error, result) ->
      #
      #  fs.writeFileSync(path, result)
      #
      #  sizes.push "Minified & Gzipped: #{fs.statSync(path).size}"
      #
      #  console.log sizes.join("\n")

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
    unless error
      #result = obscurify(result)

      mint.uglifyjs result, {}, (error, result) ->
        fs.writeFileSync("./dist/tower.min.js", result)

        gzip result, (error, result) ->

          fs.writeFileSync("./dist/tower.min.js.gz", result)

          console.log "Minified & Gzipped: #{fs.statSync("./dist/tower.min.js.gz").size}"

          fs.writeFile "./dist/tower.min.js.gz", mint.uglifyjs(result, {})

task 'docs', 'Build the docs', ->
  exec './node_modules/dox/bin/dox < ./lib/tower/route/dsl.js', (err, stdout, stderr) ->
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
      else
        table.push [path, size, "-"]
      prev = size

  console.log table.toString()

task 'clean', 'remove trailing whitespace', ->
  findit.find "./src", (file) ->
    if File.isFile(file)
      fs.writeFileSync(file, fs.readFileSync(file, "utf-8").toString().replace(/[ \t]+$/mg, ""))