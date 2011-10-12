Metro.Asset =
  css_compressors:        {}
  js_compressors:         {}
  default_css_compressor: null
  default_js_compressor:  null
  
  register_css_compressor: (name, klass, options = {}) ->
  
  register_js_compressor: (name, klass, options = {}) ->
    # var result = YAHOO.compressor.cssmin(input_css_code);
