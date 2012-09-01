module.exports =
  javascripts:
    application: [
      '/app/config/shared/application'
      # "/config/environments/#{Tower.env}"
      '/app/config/client/bootstrap'
      '/app/config/client/watch'
      '/app/config/client/routes'
      '/app/controllers/client/applicationController'
      '/templates'
      '/app/views/client/layouts/application'
    ]

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

  stylesheets:
    application: [
      '/app/stylesheets/client/application'
    ]

    lib: [

    ]

    vendor: [
      '/vendor/stylesheets/bootstrap/bootstrap'
      '/vendor/stylesheets/prettify'
    ]

    development: [
      # '/vendor/stylesheets/mocha'
    ]
