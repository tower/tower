File = require('pathfinder').File

testCases   = _.map File.files("#{Tower.root}/public/javascripts/test/cases"), (path) ->
  path.replace("#{Tower.root}/public/javascripts", "").replace(/\.js$/, "")
  
testCases   = _.select testCases, (path) ->
  #!path.match("server")
  path.match(/model|application|store|support/)
  
testModels  = _.map File.files("#{Tower.root}/public/javascripts/app"), (path) ->
  path.replace("#{Tower.root}/public/javascripts", "").replace(/\.js$/, "")
  
testModels  = _.select testModels, (path) ->
  path.match(/model|application|controller/) && !path.match('client')
  
module.exports =
  javascripts:
    application: [
      "/app/client/config/application"
      "/config/routes"
    ].concat(testModels)
    
    lib: [
      
    ]
    
    vendor: [
      "/vendor/javascripts/underscore"
      "/vendor/javascripts/underscore.string"
      "/vendor/javascripts/moment"
      "/vendor/javascripts/geolib"
      "/vendor/javascripts/validator"
      "/vendor/javascripts/accounting"
      "/vendor/javascripts/inflection"
      "/vendor/javascripts/coffeekup"
      "/vendor/javascripts/prettify"
      "/vendor/javascripts/async"
      "/vendor/javascripts/socket.io"
      "/vendor/javascripts/history"
      "/vendor/javascripts/history.adapter.jquery"
      "/vendor/javascripts/bootstrap/bootstrap-transition"
      "/vendor/javascripts/bootstrap/bootstrap-alert"
      "/vendor/javascripts/bootstrap/bootstrap-modal"
      "/vendor/javascripts/bootstrap/bootstrap-dropdown"
      "/vendor/javascripts/bootstrap/bootstrap-scrollspy"
      "/vendor/javascripts/bootstrap/bootstrap-tab"
      "/vendor/javascripts/bootstrap/bootstrap-tooltip"
      "/vendor/javascripts/bootstrap/bootstrap-popover"
      "/vendor/javascripts/bootstrap/bootstrap-button"
      "/vendor/javascripts/bootstrap/bootstrap-collapse"
      "/vendor/javascripts/bootstrap/bootstrap-carousel"
      "/vendor/javascripts/bootstrap/bootstrap-typeahead"
      "/vendor/javascripts/tower"
    ]
    
    development: [
      "/vendor/javascripts/mocha"
      "/vendor/javascripts/chai"
      "/vendor/javascripts/design.io"
      "/test/client"
    ].concat(testCases)
  
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
