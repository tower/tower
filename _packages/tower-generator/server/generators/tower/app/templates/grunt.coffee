# https://github.com/cowboy/grunt/blob/master/docs/task_init.md
module.exports = (grunt) ->
  file = grunt.file

  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-contrib-stylus')

  require('tower').Application.instance().initialize
    databases:        ['memory']
    defaultDatabase:  'memory'

  # @todo grunt.loadNpmTasks('tower-tasks')
  require(require('path').join(Tower.srcRoot, 'lib/tower-tasks/tasks'))(grunt)

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
      compile:
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
      templates:
        files: ['app/templates/*.coffee', 'app/templates/shared/**/*.coffee', 'app/templates/client/**/*.coffee']
        tasks: ['templates:compile']
    copy:
      javascripts:
        src: ['vendor/**/*.js']
        dest: 'public/javascripts'
      stylesheets:
        src: ['vendor/**/*.css']
        dest: 'public/stylesheets'
      images:
        src: ['vendor/**/*.{png,gif,jpg}']
        dest: 'public/images'
    templates:
      compile: {}
    stylus:
      compile:
        options:
          #'include css': true
          'paths': ['app/client/stylesheets']
        files:
          'public/stylesheets/app/stylesheets/client/application.css': 'app/stylesheets/client/application.styl'

  # @todo if you `npm link tower` to this app, then it should
  # copy the dist/tower.js to vendor/javascripts/tower.js when it changes.

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

  grunt.registerTask 'copy:assets', 'copy:stylesheets copy:javascripts copy:images'
  grunt.registerTask 'default', 'copy:assets coffee:compile less stylus templates'
  grunt.registerTask 'start', 'default watch'