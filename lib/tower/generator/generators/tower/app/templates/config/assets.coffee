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
      '/vendor/javascripts/socket.io'
      '/vendor/javascripts/async'
    ]
    
    development: [
      '/vendor/javascripts/design.io'
    ]
  
  stylesheets:
    application: [
      "/app/client/stylesheets/application"
    ]
    
    lib: [
      "/app/client/stylesheets/reset"
    ]
    
    vendor: [
      
    ]
    
try
  Tower.assetManifest = JSON.parse(require('fs').readFileSync('public/assets/manifest.json', 'utf-8'))
catch error
  Tower.assetManifest = {}
