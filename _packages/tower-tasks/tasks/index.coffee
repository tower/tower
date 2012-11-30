# https://github.com/kmiyashiro/grunt-mocha

module.exports = (grunt) ->
  # https://github.com/jquery/jquery-ui/blob/master/build/tasks/build.js
  fs    = require('fs')
  async = require('async')
  mint  = require('mint')
  _path = require('path')

  try
    towerPath = require.resolve('tower') # will fail on tower repo
  catch error
    towerPath = _path.join(__dirname, "..#{_path.sep}..#{_path.sep}..#{_path.sep}index.js")

  grunt.registerMultiTask 'templates', 'Compile templates', ->
    name  = ""
    taskDone = @async()
    
    files   = grunt.file.expand(["app#{_path.sep}templates#{_path.sep}**#{_path.sep}*.coffee"])
    result  = []

    pathSeparator = '/'
    pathSeparatorEscaped = '/'

    templatePath  = new RegExp("app#{pathSeparatorEscaped}templates#{pathSeparatorEscaped}.+\.coffee$")
    coffeePattern = /\.coffee$/
    layoutPath    = new RegExp("layout#{pathSeparatorEscaped}application")
    namePattern   = new RegExp("app#{pathSeparatorEscaped}templates#{pathSeparatorEscaped}(?:client|shared)#{pathSeparatorEscaped}")
    
    for file in files
      continue unless file.match(templatePath)
      continue unless file.match(coffeePattern)
      # @todo tmp, dont need these for the client
      continue if file.match(layoutPath)# || file.match('shared')
      result.push [file.replace(coffeePattern, ""), fs.readFileSync(file, 'utf-8')]
      
    template      = "Tower.View.cache =\n"

    iterator = (item, next) =>
      name = item[0].replace(namePattern, '')#.replace('/', '_')
      # _table.coffee
      fileName = name.split(pathSeparator)
      fileName = fileName[fileName.length - 1]
      return next() if fileName.match(/^_/) # if it's a partial, don't include
      try
        string = coffeecup.render(item[1])  
      catch error
        try
          prefix  = name.split(pathSeparator)[0]
          view    = new Tower.View(collectionName: prefix)
          opts    = type: 'coffee', inline: true, template: item[1].toString(), prefixes: [prefix]
          cb = (error, body) =>
            string = body
          view.render(opts, cb)
        catch error
          console.log item[0], error
          return next() # so we can still have some templates

      template += "  '#{name}': Ember.Handlebars.compile('"
      # make it render to HTML for ember
      template += "#{string}')\n"
      next()
      
    async.forEachSeries result, iterator, (error) =>
      template += '_.extend(Ember.TEMPLATES, Tower.View.cache)\n'
      mint.coffee template, bare: true, (error, string) =>
        if error
          console.log error
          return taskDone(error)
        else
          fs.writeFileSync "public#{_path.sep}javascripts#{_path.sep}templates.js", string
          taskDone()

  grunt.registerMultiTask 'injectTestDependencies', 'Modify files in place', ->
    done  = @async()
    files = grunt.file.expandFiles(@file.src)

    iterator = (filePath, next) =>
      process.nextTick ->
        packageJSON = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

        if testDependencies = packageJSON['testDependencies']
          packageJSON['scripts']['install-dev'] = "npm install #{Object.keys(testDependencies).join(' ')}"
          process.nextTick ->
            fs.writeFileSync(filePath, JSON.stringify(packageJSON, null, 2))
            next()
        else
          next()

    async.forEachSeries files, iterator, done

  grunt.registerMultiTask 'copy', 'Copy files to destination folder and replace @VERSION with pkg.version', ->
    replaceVersion = (source) ->
      # source.replace /version": "([^"]+)/g, 'version": "' + grunt.config('pkg.version')
      source.replace /@VERSION/g, grunt.config('pkg.version')

    copyFile = (src, dest) ->
      if /(js|css|json)$/.test(src)
        grunt.file.copy src, dest,
          process: replaceVersion
      else
        grunt.file.copy src, dest

    files = grunt.file.expandFiles(@file.src)
    target = @file.dest + _path.sep
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

  grunt.registerHelper 'uploadToGitHub', (local, remote, done) ->
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

  # https://github.com/avalade/grunt-coffee
  path = require("path")

  # CoffeeScript
  grunt.registerMultiTask "coffee", "Compile CoffeeScript files", ->
    dest = @file.dest + _path.sep
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

  grunt.registerHelper 'downloadDependendencies', (done) ->
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

  # @todo
  #   - create tower.dependencies.js
  #   - create tower.dependencies.css
  #   - upload individual client assets to github
  #   - upload zip of dependencies as well
  grunt.registerTask 'downloadDependencies', 'Downloads client dependencies and makes them easy to access', ->
    grunt.helper 'downloadDependencies', @async()
    
  grunt.registerHelper 'uploadDependencies', (done) ->
    require(towerPath) # tower
    {JAVASCRIPTS, STYLESHEETS, IMAGES, SWFS} = Tower.GeneratorAppGenerator

    processEach = (hash, next) =>
      keys    = _.keys(hash)

      iterator = (remote, nextDownload) =>
        local = hash[remote]
        path = ".#{_path.sep}dist#{_path.sep}#{local}"
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
        grunt.helper 'upload2GitHub', bundlePath, bundle, =>
          process.nextTick next

    processEach JAVASCRIPTS, 'tower.dependencies.js', =>
      fs.readFile bundlePath, 'utf-8', (error, content) =>
        require('mint').uglifyjs content, {}, (error, content) ->
          bundle      = 'tower.dependencies.min.js'
          bundlePath  = '.#{_path.sep}dist#{_path.sep}' + bundle
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
          outputPath = ".#{_path.sep}dist#{_path.sep}" + nodePath.resolve(path, '..').split(_path.sep).pop()
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
      fs.mkdirSync(".#{_path.sep}dist") unless fs.existsSync(".#{_path.sep}dist")
      content = compileFile(".#{_path.sep}packages#{_path.sep}tower", ".#{_path.sep}packages#{_path.sep}tower#{_path.sep}client.coffee", 0).replace /Tower\.version *= *.+\n/g, (_) ->
        version = """
    Tower.version = "#{grunt.config('pkg.version')}"

    """
      fs.writeFileSync ".#{_path.sep}dist#{_path.sep}tower.coffee", content
      mint.coffee content, bare: false, (error, result) ->
        result = grunt.config.process('meta.banner') + result
        console.error error.stack if error
        fs.writeFileSync ".#{_path.sep}dist#{_path.sep}tower.js", result

    buildIt()