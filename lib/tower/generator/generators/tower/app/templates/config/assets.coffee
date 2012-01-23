Tower.assets =
  javascripts:
    application: [
      "/app/client/config/application"
      "/config/routes"
    ]
    
    lib: [
      
    ]
    
    vendor: [
      '/vendor/javascripts/underscore'
      '/vendor/javascripts/underscore.string'
      '/vendor/javascripts/socket.io'
      '/vendor/javascripts/history'
      '/vendor/javascripts/moment'
      '/vendor/javascripts/tower'
    ]
    
    development: [
      '/vendor/javascripts/design.io'
    ]
  
  stylesheets:
    application: [
      "/app/client/stylesheets/application"
    ]
    
    lib: [
      "/lib/stylesheets/reset"
    ]
    
    vendor: [
      
    ]
    
try
  Tower.assetManifest = JSON.parse(require('fs').readFileSync('public/assets/manifest.json', 'utf-8'))
catch error
  Tower.assetManifest = {}
