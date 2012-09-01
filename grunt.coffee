# https://github.com/cowboy/grunt/blob/master/docs/task_init.md
# https://github.com/kmiyashiro/grunt-mocha
# https://github.com/shama/grunt-hub/blob/master/tasks/watch.js
module.exports = (grunt) ->
  require('./packages/tower-tasks/tasks')(grunt)

  _     = grunt.utils._
  file  = grunt.file

  githubDownloadStore = null

  # CoffeeScript files
  files = _.select file.expand(['packages/**/*.coffee']), (i) ->
    !i.match('templates')

  towerFiles = ['lib/tower/client.js']

  config =
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
      all:
        src: files
        dest: 'lib'
        strip: 'packages/'
        options:
          bare: true
    copy:
      packageJSON:
        src: ['packages/**/package.json', 'packages/tower-generator/server/generators/**/templates/**/*']
        strip: 'packages/'
        dest: 'lib'
    watch:
      packageJSON:
        files: ['packages/**/package.json', 'packages/tower-generator/server/generators/**/templates/**/*']
        tasks: ['copy:packageJSON']
    build:
      client: {}
    uploadToGithub:
      tower: {}
    dependencies:
      client: {}
    bundleDependencies:
      client: {}

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

  files.forEach (name) ->
    config.coffee[name] =
      src: name
      dest: 'lib'
      strip: 'packages/'
      options:
        bare: true
    config.watch[name] =
      files: [name]
      tasks: ["coffee:#{name}"]

  grunt.initConfig(config)

  #grunt.loadNpmTasks 'grunt-coffee'
  grunt.registerTask 'default', 'coffee:all copy build:client'
  grunt.registerTask 'start', 'default watch'
  grunt.registerTask 'dist', 'build uploadToGithub'

  grunt.registerTask 'uploadToGithub', ->
    taskComplete = @async()
    grunt.helper 'uploadToGitHub', 'dist/tower.js', 'tower.js', taskComplete
