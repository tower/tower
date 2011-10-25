class Configuration
  load_paths:           ["./app/assets", "./lib/assets", "./vendor/assets"]
  css:                []
  js:                 []
  version:            1.0
  enabled:            true
  js_compressor:      "uglifier"
  css_compressor:     "yui"
  css_paths:          []
  js_paths:           []
  path:               "./assets"
  public_path:        "./public"
  
  compress:           true
  compile:            true
  digest:             true
  debug:              false
  
module.exports = Configuration
