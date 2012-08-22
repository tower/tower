# https://github.com/cowboy/grunt/blob/master/docs/task_init.md
# https://github.com/kmiyashiro/grunt-mocha
module.exports = (grunt) ->
  require('./build/tasks')(grunt)

  _     = grunt.utils._
  file  = grunt.file

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
        files: ['packages/**/package.json']
        tasks: ['copy:packageJSON']
    build:
      client: {}
    uploadToGithub:
      tower: {}

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

  for name in files
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
  grunt.registerTask 'default', 'coffee:all copy dist:client'
  grunt.registerTask 'start', 'default watch'
  grunt.registerTask 'dist', 'build uploadToGithub'

  grunt.registerTask 'uploadToGithub', ->
    taskComplete = @async()

    fs    = require('fs')
    exec  = require('child_process').exec

    size        = fs.statSync('dist/tower.js').size
    contentType = 'text/plain'
    name        = 'tower.js'
    version     = grunt.config('pkg.version')

    exec 'git config --global github.token', (error, token) ->
      throw new Error """
      Make sure you have created a GitHub token.
      git config --global github.token <hash>
      """ if error

      removeExisting = (callback) ->
        step0 = """
        curl https://api.github.com/repos/viatropos/tower/downloads?access_token=#{token}
        """

        exec step0, (error, data) ->
          data      = JSON.parse(data)
          downloads = if grunt.utils._.isArray(data) then data else []
          existing  = null
          for download in downloads
            if download.name == name
              existing = download
              break
          if existing
            step00 = """
            curl -X DELETE https://api.github.com/repos/viatropos/tower/downloads/#{existing.id}?access_token=#{token}
            """
            exec step00, callback
          else
            callback()

      removeExisting ->
        step1 = """
        curl -X POST 
          -d '{"name": "#{name}","size": #{size},"description": "#{version}","content_type": "#{contentType}"}' 
          https://api.github.com/repos/viatropos/tower/downloads?access_token=#{token}
        """.replace(/\n/g, '')
        
        exec step1, (error, data) ->
          data = JSON.parse(data)

          step2 = """
            curl
            -F "key=#{data.path}"
            -F "acl=#{data.acl}"
            -F "success_action_status=201"
            -F "Filename=#{data.name}"
            -F "AWSAccessKeyId=#{data.accesskeyid}"
            -F "Policy=#{data.policy}"
            -F "Signature=#{data.signature}"
            -F "Content-Type=#{data.mime_type}"
            -F "file=@dist/#{name}"
            https://github.s3.amazonaws.com/
          """.replace(/\n/g, ' ')

          exec step2, (error, data) ->
            console.error error if error
            taskComplete()
      
