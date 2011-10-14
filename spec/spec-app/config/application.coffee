Metro.configure ->
  @assets.path            = "#{Metro.root}/public/assets"
  @assets.css_compressor  = "yui"
  @assets.js_compressor   = "uglifier"
  @assets.js              = ["application.js"]
  @assets.css             = ["application.css", "theme.css"]
  @assets.css_paths       = ["./app/assets/stylesheets"]
  @assets.js_paths        = ["./app/assets/javascripts"]
