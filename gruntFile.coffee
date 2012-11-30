# https://github.com/cowboy/grunt/blob/master/docs/task_init.md
# https://github.com/kmiyashiro/grunt-mocha
# https://github.com/shama/grunt-hub/blob/master/tasks/watch.js
module.exports = (grunt) ->

  _ = require("underscore");
  _path = require("path");

  jsSrcPaths = _.select grunt.file.expand([
    'packages/**/*.js'
  ]), (i) ->
    !i.match('templates')

  config =
    copy:
      packageJSON:
        src: ['packages/**/package.json', 'packages/tower-generator/server/generators/**/templates/**/*']
        strip: 'packages/'
        dest: 'lib'
      clientForTests:
        src: ['dist/tower.js']
        strip: 'dist/'
        dest: _path.join('test/example', 'vendor/javascripts')
      js:
        src: jsSrcPaths
        strip: 'packages/'
        dest: 'lib'
    watch:
      packageJSON:
        files: ['packages/**/package.json', 'packages/tower-generator/server/generators/**/templates/**/*']
        tasks: ['copy:packageJSON']

  jsSrcPaths.forEach (name) ->
    config.copy[name] =
      src: name
      dest: 'lib'
      strip: 'packages/'
    config.watch[name] =
      files: [name]
      tasks: ["copy:#{name}"]


  grunt.initConfig(config)
  grunt.registerTask 'default', 'copy:js'
  grunt.registerTask 'start', 'default watch'
  grunt.registerTask 'dist', 'build uploadToGithub'
  grunt.registerTask ''