module.exports = (grunt) ->
  # https://github.com/jquery/jquery-ui/blob/master/build/tasks/build.js
  grunt.registerMultiTask 'copy', 'Copy files to destination folder and replace @VERSION with pkg.version', ->
    replaceVersion = (source) ->
      source.replace /@VERSION/g, grunt.config('pkg.version')

    copyFile = (src, dest) ->
      if /(js|css|json)$/.test(src)
        grunt.file.copy src, dest,
          process: replaceVersion
      else
        grunt.file.copy src, dest

    files = grunt.file.expandFiles(@file.src)
    target = @file.dest + '/'
    strip = @data.strip
    renameCount = 0
    fileName = undefined
    strip = new RegExp('^' + grunt.template.process(strip, grunt.config()).replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&'))  if typeof strip is 'string'
    files.forEach (fileName) ->
      targetFile = (if strip then fileName.replace(strip, '') else fileName)
      copyFile fileName, target + targetFile

    grunt.log.writeln 'Copied ' + files.length + ' files.'
    for fileName of @data.renames
      renameCount += 1
      copyFile fileName, target + grunt.template.process(@data.renames[fileName], grunt.config())
    grunt.log.writeln 'Renamed ' + renameCount + ' files.'  if renameCount

  # https://github.com/avalade/grunt-coffee
  path = require("path")
  # CoffeeScript
  grunt.registerMultiTask "coffee", "Compile CoffeeScript files", ->
    dest = @file.dest + '/'
    options = @data.options
    strip = @data.strip
    extension = @data.extension
    strip = new RegExp('^' + grunt.template.process(strip, grunt.config()).replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&'))  if typeof strip is 'string'
    grunt.file.expandFiles(@file.src).forEach (filepath) ->
      targetFile = dest + (if strip then filepath.replace(strip, '') else filepath)
      grunt.helper "coffee", filepath, targetFile, grunt.utils._.clone(options), extension

    if grunt.task.current.errorCount
      false
    else
      true

  grunt.registerHelper "coffee", (src, destPath, options, extension) ->
    coffee = require("coffee-script")
    js = ""
    options = options or {}
    extension = (if extension then extension else ".js")
    dest = path.dirname(destPath) + '/' + path.basename(destPath, ".coffee") + extension
    #console.log dest
    options.bare = true  if options.bare isnt false
    try
      js = coffee.compile(grunt.file.read(src), options)
      grunt.file.write dest, js
      return true
    catch e
      grunt.log.error "Error in " + src + ":\n" + e
      return false

  grunt.registerHelper 'downloadDependendencies', (done) ->
    require('../index.js') # tower
    agent   = require('superagent')
    fs      = require('fs')
    wrench  = require('wrench')
    _path   = require('path')

    {JAVASCRIPTS, STYLESHEETS, IMAGES, SWFS} = Tower.GeneratorAppGenerator

    processEach = (hash, bundle, next) =>
      keys    = _.keys(hash)
      #if bundle
      #  writeStream = fs.createWriteStream("./dist/#{bundle}", flags: 'a', encoding: 'utf-8')
      #  writeStream.on 'drain', ->
      #    #next()

      iterator = (remote, nextDownload) =>
        local = hash[remote]
        dir   = _path.resolve('./dist', _path.dirname(local))

        wrench.mkdirSyncRecursive(dir)

        agent.get(remote).end (response) =>
          #writeStream.write(response.text) if writeStream

          path = "./dist/#{local}"
          fs.writeFile path, response.text, =>
            process.nextTick nextDownload

      Tower.async keys, iterator, next

    # This will then bundle all assets into one file, 
    # tower.dependencies.js, so you can include it to create quick demos/gists/fiddles.
    bundleAll = =>

    processEach JAVASCRIPTS, 'tower.dependencies.js', =>
      processEach STYLESHEETS, 'tower.dependencies.css', =>
        processEach IMAGES, null, =>
          processEach SWFS, null, =>
            done()

  # @todo
  #   - create tower.dependencies.js
  #   - create tower.dependencies.css
  #   - upload individual client assets to github
  #   - upload zip of dependencies as well
  grunt.registerTask 'downloadDependencies', 'Downloads client dependencies and makes them easy to access', ->
    grunt.helper 'downloadDependencies', @async()
    
  grunt.registerHelper 'uploadDependencies', (done) ->
    require('../index.js') # tower
    {JAVASCRIPTS, STYLESHEETS, IMAGES, SWFS} = Tower.GeneratorAppGenerator

    processEach = (hash, next) =>
      keys    = _.keys(hash)

      iterator = (remote, nextDownload) =>
        local = hash[remote]
        path = "./dist/#{local}"
        grunt.helper 'upload2GitHub', path, local, nextUpload

      Tower.async keys, iterator, next

    processEach JAVASCRIPTS,  =>
      processEach STYLESHEETS, =>
        processEach IMAGES, =>
          processEach SWFS, =>
            done()

  grunt.registerTask 'uploadDependencies', 'Downloads client dependencies and makes them easy to access', ->
    grunt.helper 'uploadDependencies', @async()

  grunt.registerHelper 'bundleDependencies', (done) ->
    require('../index.js') # tower
    fs = require('fs')
    {JAVASCRIPTS} = Tower.GeneratorAppGenerator
    bundlePath  = null

    processEach = (hash, bundle, next) =>
      keys            = _.keys(hash)
      currentCallback = null
      bundlePath      = "./dist/#{bundle}"

      writeStream     = fs.createWriteStream(bundlePath, flags: 'w', encoding: 'utf-8')
      writeStream.on 'drain', ->
        currentCallback() if currentCallback

      iterator = (remote, nextDownload) =>
        currentCallback = nextDownload
        local           = hash[remote]
        fs.readFile "./dist/#{local}", 'utf-8', (error, content) =>
          next() if writeStream.write(content)

      Tower.async keys, iterator, =>
        grunt.helper 'upload2GitHub', bundlePath, bundle, =>
          process.nextTick next

    processEach JAVASCRIPTS, 'tower.dependencies.js', =>
      fs.readFile bundlePath, 'utf-8', (error, content) =>
        require('mint').uglifyjs content, {}, (error, content) ->
          bundle      = 'tower.dependencies.min.js'
          bundlePath  = './dist/' + bundle
          fs.writeFile bundlePath, content, =>
            process.nextTick =>
              grunt.helper 'upload2GitHub', bundlePath, bundle, =>
                done()

  grunt.registerTask 'bundleDependencies', ->
    grunt.helper 'bundleDependencies', @async()

  grunt.registerMultiTask 'build', 'Build tower for the client', ->
    fs      = require 'fs'
    mint    = require 'mint'
    nodePath = require 'path'

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
            console.info _path
            console.error error.stack
            ""
        data = data.replace(/module\.exports\s*=.*\s*/g, "")
        data + "\n\n"
        if level == 1
          outputPath = './dist/' + nodePath.resolve(path, '..').split('/').pop()
          fs.writeFileSync outputPath + '.coffee', data
          mint.coffee data, bare: false, (error, result) ->
            # result = JS_COPYRIGHT + result
            console.error error.stack if error
            fs.writeFileSync outputPath + '.js', result
        data
      catch error
        console.log error
        ""

    buildIt = ->
      fs.mkdirSync('./dist') unless fs.existsSync('./dist')
      content = compileFile("./packages/tower", "./packages/tower/client.coffee", 0).replace /Tower\.version *= *.+\n/g, (_) ->
        version = """
    Tower.version = "#{grunt.config('pkg.version')}"

    """
      fs.writeFileSync './dist/tower.coffee', content
      mint.coffee content, bare: false, (error, result) ->
        result = grunt.config.process('meta.banner') + result
        console.error error.stack if error
        fs.writeFileSync "./dist/tower.js", result

    buildIt()