require 'tower'
knox  = require 'knox'

task 'assets:upload', ->
  invoke 'assets:upload:s3'

task 'assets:upload:s3', ->
  invoke 'environment'
  
  client  = knox.createClient Tower.config.credentials.s3
  
  Tower.Application.Assets.upload (from, to, headers, callback) ->
    client.putFile from, to, headers, callback

task 'assets:bundle', ->
  invoke 'environment'
  Tower.Application.Assets.bundle()
  
task 'assets:stats', 'Table displaying uncompressed, minified, and gzipped asset sizes', ->
  invoke 'environment'
  Tower.Application.Assets.stats()

task 'db:seed', ->
  require('tower').Application.instance().initialize =>
    require './db/seeds'

task 'environment', ->
  Tower.env = 'production'
  Tower.Application.instance().initialize()
  
task 'routes', ->
  invoke 'environment'

  result  = []
  routes  = Tower.Route.all()

  result
