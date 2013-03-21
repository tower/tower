_path = require('path')

try
  towerPath = require.resolve('tower') # will fail on tower repo
catch error
  towerPath = _path.join(__dirname, "..#{_path.sep}..#{_path.sep}..#{_path.sep}index.js")

exports.init = (grunt) ->
  exports = {}

  exports.uploadToGitHub = (local, remote, done) ->
    require(towerPath)
    console.log 'Uploading', local, 'to GitHub...', remote

    # @todo initialize this better
    withStore = (block) =>
      unless githubDownloadStore
        githubDownloadStore = Tower.GithubDownloadStore.create()
        githubDownloadStore.configure =>
          block(githubDownloadStore)
      else
        block(githubDownloadStore)

    withStore (store) =>
      criteria =
        from:         local
        to:           remote
        name:         remote
        repo:         'tower'
        description:  grunt.config('pkg.version')

      store.update criteria, done

  path = require("path")

  exports.coffee = (src, destPath, options, extension) ->
    coffee = require("coffee-script")
    js = ""
    options = options or {}
    extension = (if extension then extension else ".js")
    dest = path.dirname(destPath) + _path.sep + path.basename(destPath, ".coffee") + extension
    #console.log dest
    options.bare = true  if options.bare isnt false
    try
      js = coffee.compile(grunt.file.read(src), options)
      grunt.file.write dest, js
      return true
    catch e
      grunt.log.error "Error in " + src + ":\n" + e
      return false

  exports.downloadDependendencies = (done) ->
    require(towerPath) # tower
    agent   = require('superagent')
    fs      = require('fs')
    wrench  = require('wrench')

    {JAVASCRIPTS, STYLESHEETS, IMAGES, SWFS} = Tower.GeneratorAppGenerator

    processEach = (hash, bundle, next) =>
      keys    = _.keys(hash)
      #if bundle
      #  writeStream = fs.createWriteStream("./dist/#{bundle}", flags: 'a', encoding: 'utf-8')
      #  writeStream.on 'drain', ->
      #    #next()

      iterator = (remote, nextDownload) =>
        local = hash[remote]
        dir   = _path.resolve(".#{_path.sep}dist", _path.dirname(local))

        wrench.mkdirSyncRecursive(dir)

        agent.get(remote).end (response) =>
          #writeStream.write(response.text) if writeStream

          path = ".#{_path.sep}dist#{_path.sep}#{local}"
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

  exports.uploadDependencies = (done) ->
    require(towerPath) # tower
    {JAVASCRIPTS, STYLESHEETS, IMAGES, SWFS} = Tower.GeneratorAppGenerator

    processEach = (hash, next) =>
      keys    = _.keys(hash)

      iterator = (remote, nextDownload) =>
        local = hash[remote]
        path = ".#{_path.sep}dist#{_path.sep}#{local}"
        exports.upload2GitHub path, local, nextUpload

      Tower.async keys, iterator, next

    processEach JAVASCRIPTS,  =>
      processEach STYLESHEETS, =>
        processEach IMAGES, =>
          processEach SWFS, =>
            done()

  exports.bundleDependencies = (done) ->
    require(towerPath) # tower
    fs = require('fs')
    JAVASCRIPTS = [
      'underscore'
      'underscore.string'
      'moment'
      'geolib'
      'validator'
      'accounting'
      'inflection'
      'async'
      'socket.io'
      'handlebars'
      'ember'
      'tower'
      "bootstrap#{_path.sep}bootstrap-dropdown"
    ]
    bundlePath  = null

    processEach = (keys, bundle, next) =>
      currentCallback = null
      bundlePath      = ".#{_path.sep}dist#{_path.sep}#{bundle}"

      writeStream     = fs.createWriteStream(bundlePath, flags: 'w', encoding: 'utf-8')
      writeStream.on 'drain', ->
        currentCallback() if currentCallback

      iterator = (local, nextDownload) =>
        currentCallback = nextDownload
        local           = local + '.js'
        fs.readFile ".#{_path.sep}dist#{_path.sep}#{local}", 'utf-8', (error, content) =>
          next() if writeStream.write(content)

      Tower.async keys, iterator, =>
        exports.upload2GitHub bundlePath, bundle, =>
          process.nextTick next

    processEach JAVASCRIPTS, 'tower.dependencies.js', =>
      fs.readFile bundlePath, 'utf-8', (error, content) =>
        require('mint').uglifyjs content, {}, (error, content) ->
          bundle      = 'tower.dependencies.min.js'
          bundlePath  = '.#{_path.sep}dist#{_path.sep}' + bundle
          fs.writeFile bundlePath, content, =>
            process.nextTick =>
              exports.upload2GitHub bundlePath, bundle, =>
                done()

  exports