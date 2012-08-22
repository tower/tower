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