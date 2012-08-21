module.exports = (grunt) ->
  require('./build/tasks')(grunt)

  _     = grunt.utils._
  file  = grunt.file

  # CoffeeScript files
  files = _.select file.expand(['packages/**/*.coffee']), (i) ->
    !i.match('templates')

  grunt.initConfig
    pkg: '<json:package.json>'
    coffee:
      app:
        src: files
        dest: 'lib'
        strip: 'packages/'
        options:
          bare: true
    copy:
      packageJSON:
        src: 'packages/**/package.json'
        strip: 'packages/'
        dest: 'lib'

    watch:
      coffee:
        files: ['<config:coffee.app.src>']
        tasks: ['coffee:app']
      packageJSON:
        files: ['packages/**/package.json']
        tasks: ['copy:packageJSON']

  #grunt.loadNpmTasks 'grunt-coffee'
  grunt.registerTask 'default', 'coffee copy'
