# https://github.com/kmiyashiro/grunt-mocha

module.exports = (grunt) ->
  # https://github.com/jquery/jquery-ui/blob/master/build/tasks/build.js
  fs    = require('fs')
  async = require('async')
  mint  = require('mint')
  _path = require('path')
  helpers = require('./gruntHelpers').init(grunt)

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
    files = grunt.file.expand(@file.src)

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

    files = undefined
    target = undefined

    @files.forEach ((f) ->
      files = grunt.file.expand(f.src)
      target = f.dest + _path.sep
    ), this

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
    dest = undefined

    @files.forEach ((f) ->
      dest = f.dest + _path.sep
    ), this

    options = @data.options
    strip = @data.strip
    extension = @data.extension
    strip = new RegExp('^' + grunt.template.process(strip, grunt.config()).replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&'))  if typeof strip is 'string'
    grunt.file.expand(@filesSrc).forEach (filepath) ->
      targetFile = dest + (if strip then filepath.replace(strip, '') else filepath)
      helpers.coffee filepath, targetFile, grunt.util._.clone(options), extension

    if grunt.task.current.errorCount
      false
    else
      true

  # @todo
  #   - create tower.dependencies.js
  #   - create tower.dependencies.css
  #   - upload individual client assets to github
  #   - upload zip of dependencies as well
  grunt.registerTask 'downloadDependencies', 'Downloads client dependencies and makes them easy to access', ->
    helpers.downloadDependencies @async()

  grunt.registerTask 'uploadDependencies', 'Downloads client dependencies and makes them easy to access', ->
    helpers.uploadDependencies @async()

  grunt.registerTask 'bundleDependencies', ->
    helpers.bundleDependencies @async()

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