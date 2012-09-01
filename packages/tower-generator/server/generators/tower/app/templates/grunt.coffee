# https://github.com/cowboy/grunt/blob/master/docs/task_init.md
# https://github.com/kmiyashiro/grunt-mocha
module.exports = (grunt) ->
  grunt.loadNpmTasks('grunt-less')
  grunt.loadNpmTasks('grunt-stylus')
  async = require('async')
  mint  = require('mint')
  coffeecup = require('coffeecup')
  fs    = require('fs')

  require('tower')
  # @todo tmp
  Tower.Application.instance().initialize()

  grunt.registerMultiTask 'templates', 'Compile templates', ->
    name  = ""
    taskDone = @async()
    
    files   = grunt.file.expand(['app/templates/**/*.coffee'])
    result  = []
    
    for file in files
      continue unless file.match(/app\/templates\/.+\.coffee$/)
      continue unless file.match(/\.coffee$/)
      # @todo tmp, dont need these for the client
      continue if file.match('layout/application')# || file.match('shared')
      result.push [file.replace(/\.coffee$/, ""), fs.readFileSync(file)]
      
    template      = "Tower.View.cache =\n"
    
    iterator = (item, next) =>
      name = item[0].replace(/app\/templates\/(?:client|shared)\//, '')#.replace('/', '_')
      # _table.coffee
      fileName = name.split('/')
      fileName = fileName[fileName.length - 1]
      return next() if fileName.match(/^_/) # if it's a partial, don't include
      try
        string = coffeecup.render(item[1])  
      catch error
        try
          prefix  = name.split('/')[0]
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
          fs.writeFileSync "public/javascripts/templates.js", string
          taskDone()

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

  _     = grunt.utils._
  file  = grunt.file

  # CoffeeScript files
  files = file.expand([
    'app/!(templates)/**/*.coffee'
    'test/**/*.coffee'
    'config/shared/locales/**/*.coffee'
    'config/server/locales/**/*.coffee'
    'config/shared/application.coffee'
    'config/server/application.coffee'
    'config/shared/routes.coffee'
    'config/server/routes.coffee'
    'config/shared/assets.coffee'
    'config/shared/assets.coffee'
  ])

  jsFiles = file.expand([
    'vendor/javascripts/**/*.js'
  ])

  config =
    pkg: '<json:package.json>'
    coffee:
      all:
        src: files
        dest: 'public/javascripts'
        options:
          bare: false
    less:
      bootstrap:
        src: 'vendor/stylesheets/bootstrap/bootstrap.less'
        dest: 'public/stylesheets/vendor/stylesheets/bootstrap/bootstrap.css'
    watch:
      stylus:
        files: ['app/stylesheets/client/application.styl']
        tasks: ['stylus']
    copy:
      js:
        src: ['vendor/**/*.js']
        dest: 'public/javascripts'
      css:
        src: ['vendor/**/*.css']
        dest: 'public/stylesheets'
    templates:
      all: {}
    stylus:
      compile:
        options:
          #'include css': true
          'paths': ['app/client/stylesheets']
        files:
          'public/stylesheets/app/stylesheets/client/application.css': 'app/stylesheets/client/application.styl'

  for name in files
    config.coffee[name] =
      src: name
      dest: 'public/javascripts'
      options:
        bare: true
    config.watch[name] =
      files: [name]
      tasks: ["coffee:#{name}"]

  for name in jsFiles
    config.copy[name] =
      src: [name]
      dest: 'public/javascripts'
    config.watch[name] =
      files: [name]
      tasks: ["copy:#{name}"]

  grunt.initConfig(config)

  #grunt.loadNpmTasks 'grunt-coffee'
  grunt.registerTask 'default', 'copy:js copy:css coffee:all less stylus templates'
  grunt.registerTask 'start', 'default watch'