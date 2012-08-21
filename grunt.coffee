module.exports = (grunt) ->
  _     = grunt.utils._
  file  = grunt.file

  # CoffeeScript files
  files = _.select file.expand(['packages/**/*.coffee']), (i) ->
    !i.match('templates')

  grunt.initConfig
    coffee:
      app:
        src: files
        dest: "tmp"
        options:
          bare: true
          preserve_dirs: true
    copy:
      packageJSON:
        src: 'packages/**/package.json'
        strip: 'packages'
        dest: "tmp"

    watch:
      coffee:
        files: ["<config:coffee.app.src>"]
        tasks: ["coffee:app"]
      packageJSON:
        files: ['packages/**/package.json']
        tasks: ['copy:package']

  grunt.loadNpmTasks "grunt-coffee"
  grunt.registerTask "default", "coffee"
  #grunt.registerTask "copy"
  