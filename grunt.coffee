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
 * Copyright 2012, Lance Pollard
 * MIT License.
 * http://towerjs.org/license
 *
 * Date: <%= grunt.template.today('isoDate') %>
 */

"""
    concat:
      tower:
        src: ['<meta:banner>', towerFiles],
        dest: 'dist/tower.js'
      core:       {}
      model:      {}
      controller: {}

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
