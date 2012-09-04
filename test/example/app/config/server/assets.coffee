File = require('pathfinder').File
_path = require('path')

testCasesPath = "#{Tower.root}/public/javascripts/test/cases"

testCases   = _.map File.files(testCasesPath), (path) ->
  path.replace("#{Tower.root}/public/javascripts", "").replace(/\.js$/, "")

testCases   = _.select testCases, (path) ->
  # for now, don't use the compiled files.
  return false if path.match(/\/test\/cases\/[^\/]+\.js/)
  true
  
testModels  = _.map File.files("#{Tower.root}/public/javascripts/app"), (path) ->
  path.replace("#{Tower.root}/public/javascripts", "").replace(/\.js$/, "")
  
testModels  = _.select testModels, (path) ->
  path.match(/models|controllers/) && !path.match('client')

testModels = testModels.concat [
  "/app/client/controllers/testUsersController"
]
  
module.exports =
  javascripts:
    application: [
      '/app/config/shared/application'
      # "/config/environments/#{Tower.env}"
      '/app/config/client/bootstrap'
      '/app/config/shared/routes'
      '/app/controllers/client/applicationController'
      '/templates'
      '/app/views/client/layout/application'
    ].concat(testModels)
    
    lib: [
      
    ]
    
    vendor: [
      '/vendor/javascripts/underscore'
      '/vendor/javascripts/underscore.string'
      '/vendor/javascripts/moment'
      '/vendor/javascripts/geolib'
      '/vendor/javascripts/validator'
      '/vendor/javascripts/accounting'
      '/vendor/javascripts/inflection'
      '/vendor/javascripts/async'
      '/vendor/javascripts/socket.io'
      '/vendor/javascripts/handlebars'
      '/vendor/javascripts/ember'
      '/vendor/javascripts/jstorage'
      '/vendor/javascripts/tower'
      # '/vendor/javascripts/uri'
      # '/vendor/javascripts/bootstrap/bootstrap-transition'
      # '/vendor/javascripts/bootstrap/bootstrap-alert'
      # '/vendor/javascripts/bootstrap/bootstrap-modal'
      '/vendor/javascripts/bootstrap/bootstrap-dropdown'
      # '/vendor/javascripts/bootstrap/bootstrap-scrollspy'
      # '/vendor/javascripts/bootstrap/bootstrap-tab'
      # '/vendor/javascripts/bootstrap/bootstrap-tooltip'
      # '/vendor/javascripts/bootstrap/bootstrap-popover'
      # '/vendor/javascripts/bootstrap/bootstrap-button'
      # '/vendor/javascripts/bootstrap/bootstrap-collapse'
      # '/vendor/javascripts/bootstrap/bootstrap-carousel'
      # '/vendor/javascripts/bootstrap/bootstrap-typeahead'
      # '/vendor/javascripts/prettify'
    ]
    
    development: [
      '/vendor/javascripts/mocha'
      '/vendor/javascripts/chai'
      '/test/client'
    ]

    tests: testCases
  
  stylesheets:
    application: [
      # "/app/client/stylesheets/application"
    ]
    
    lib: [
      
    ]
    
    vendor: [
      # "/vendor/stylesheets/bootstrap/bootstrap"
      # "/vendor/stylesheets/prettify"
    ]
    
    development: [
      "/vendor/stylesheets/mocha"
    ]
