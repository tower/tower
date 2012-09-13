# https://github.com/cowboy/grunt/blob/master/docs/task_init.md
# https://github.com/kmiyashiro/grunt-mocha
# https://github.com/shama/grunt-hub/blob/master/tasks/watch.js
module.exports = (grunt) ->
  require('./packages/tower-tasks/tasks')(grunt)

  require('./coffee-inheritance')

  _     = grunt.utils._
  file  = grunt.file
  _path = require('path')

  githubDownloadStore = null

  # CoffeeScript files
  srcPaths = _.select file.expand([
    'packages/**/*.coffee'
  ]), (i) ->
    !i.match('templates')

  clientTestPaths = file.expand([
    'test/cases/*/shared/**/*.coffee'
    'test/cases/*/client/**/*.coffee'
  ])

  clientTestDestinationPath = 'test/example/public/javascripts'

  clientTestMap = {}
  testCasesPath = _path.relative(process.cwd(), 'test/cases')

  clientTestPaths.forEach (path) ->
    key   = path.replace(testCasesPath, '').split(_path.sep)[1]
    array = clientTestMap[key] ||= []
    array.push(path)

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
        src: srcPaths
        dest: 'lib'
        strip: 'packages/'
        options:
          bare: true
      tests:
        src: clientTestPaths
        dest: clientTestDestinationPath
        options:
          bare: false
    copy:
      packageJSON:
        src: ['packages/**/package.json', 'packages/tower-generator/server/generators/**/templates/**/*']
        strip: 'packages/'
        dest: 'lib'
      clientForTests:
        src: ['dist/tower.js']
        strip: 'dist/'
        dest: _path.join('test/example', 'vendor/javascripts')
    watch:
      packageJSON:
        files: ['packages/**/package.json', 'packages/tower-generator/server/generators/**/templates/**/*']
        tasks: ['copy:packageJSON']
      #mainPackageJSON:
      #  files: ['package.json']
      #  tasks: ['injectTestDependencies:packageJSON']
    build:
      client: {}
    uploadToGithub:
      tower: {}
    dependencies:
      client: {}
    bundleDependencies:
      client: {}
    bundleTests:
      client: {}
    injectTestDependencies:
      packageJSON:
        src: ['package.json']

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

  srcPaths.forEach (name) ->
    config.coffee[name] =
      src: name
      dest: 'lib'
      strip: 'packages/'
      options:
        bare: true
    config.watch[name] =
      files: [name]
      tasks: ["coffee:#{name}"]

  # clientTestPaths.forEach (name) ->

  concatTestsCommand = []

  for key, value of clientTestMap
    dest = _path.join(clientTestDestinationPath, 'test/cases', key + 'Test.js')

    concatTestCommand = "concat:#{key}Tests"
    concatTestsCommand.push(concatTestCommand)

    for name in value
      config.coffee[name] =
        src: name
        dest: clientTestDestinationPath
        options:
          bare: false
      config.watch[name] =
        files: [name]
        tasks: ["coffee:#{name}"]#, concatTestCommand]

    src = _.map value, (i) ->
      _path.join(clientTestDestinationPath, i).replace(/\.coffee$/, '.js')
    
    config.concat["#{key}Tests"] =
      src: src
      dest: dest

    # @todo need to copy file to test/x when it changes
    #for name in src
    #  config.concat[name]

  grunt.initConfig(config)

  #grunt.loadNpmTasks 'grunt-coffee'
  grunt.registerTask 'concat:tests', concatTestsCommand.join(' ')
  grunt.registerTask 'default', 'coffee:all copy:packageJSON build:client copy:clientForTests coffee:tests concat:tests'
  grunt.registerTask 'start', 'default watch'
  grunt.registerTask 'dist', 'build uploadToGithub'
  grunt.registerTask ''

  grunt.registerTask 'uploadToGithub', ->
    taskComplete = @async()
    grunt.helper 'uploadToGitHub', 'dist/tower.js', 'tower.js', taskComplete
