# https://github.com/cowboy/grunt/blob/master/docs/task_init.md
# https://github.com/kmiyashiro/grunt-mocha
module.exports = (grunt) ->
  require('./build/tasks')(grunt)

  _     = grunt.utils._
  file  = grunt.file

  # CoffeeScript files
  files = _.select file.expand(['packages/**/*.coffee']), (i) ->
    !i.match('templates')

  towerFiles = []

  grunt.initConfig
    pkg: '<json:package.json>'
    meta:
      banner: """
/*!
 * Tower.js v<%= pkg.version %>
 * <%= pkg.homepage %>
 *
 * Copyright <%= grunt.template.today('yyyy') %>, Lance Pollard
 * <%= _.pluck(pkg.licenses, 'type').join(', ') %> License.
 * http://towerjs.org/license
 *
 * Date: <%= grunt.template.today('isoDate') %>
 */

"""
    concat:
      tower:
        src: ['<banner>', towerFiles]
        dest: 'dist/tower.js'
      core: 
        src: ['<banner>', towerFiles]
        dest: 'dist/tower.core.js'
      # If you only want the model on the client
      model:
        src: ['<banner>', towerFiles]
        dest: 'dist/tower.model.js'
      # If you want the controller/route functionality as well
      controller:
        src: ['<banner>', towerFiles]
        dest: 'dist/tower.controller.js'
    min:
      dist:
        src: ['dist/tower.js']
        dest: 'dist/tower.min.js'
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
    client:
      app: {}
    #jshint:
    #  options:
    #    curly: true
    #    eqeqeq: true
    #    immed: true
    #    latedef: true
    #    newcap: true
    #    noarg: true
    #    sub: true
    #    undef: true
    #    eqnull: true
    #    browser: true

  #grunt.loadNpmTasks 'grunt-coffee'
  grunt.registerTask 'default', 'coffee copy client'
