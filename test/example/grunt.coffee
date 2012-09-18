# https://github.com/cowboy/grunt/blob/master/docs/task_init.md
module.exports = (grunt) ->
  file = grunt.file
  _path = require('path')

  grunt.loadNpmTasks('grunt-less')
  grunt.loadNpmTasks('grunt-stylus')

  process.env.TOWER_ROOT = __dirname

  require("coffee-script")
  require(__dirname + '/../..')

  Tower.View.engine = "coffee"
  # must run `node server` relative to this test/example folder
  Tower.View.store().loadPaths = ["app/templates/shared", "app/templates/server"]

  Tower.watch = false

  Tower.Application.instance().initialize
    databases:        ['memory']
    defaultDatabase:  'memory'

  # @todo grunt.loadNpmTasks('tower-tasks')
  require(_path.join(Tower.srcRoot, 'lib/tower-tasks/tasks'))(grunt)

  # script files
  scriptPaths = file.expand([
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

  # vendor script files
  vendorScriptPaths = file.expand([
    'vendor/javascripts/**/*.js'
  ])

  config =
    pkg: '<json:package.json>'
    coffee:
      all:
        src: scriptPaths
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

  scriptPaths.forEach (name) ->
    config.coffee[name] =
      src: name
      dest: 'public/javascripts'
      options:
        bare: true
    config.watch[name] =
      files: [name]
      tasks: ["coffee:#{name}"]

  vendorScriptPaths.forEach (name) ->
    config.copy[name] =
      src: [name]
      dest: 'public/javascripts'
    config.watch[name] =
      files: [name]
      tasks: ["copy:#{name}"]

  grunt.initConfig(config)

  grunt.registerTask 'default', 'copy:js copy:css coffee:all less stylus templates'
  grunt.registerTask 'start', 'default watch'