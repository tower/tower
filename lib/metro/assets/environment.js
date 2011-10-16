(function() {
  var Environment, crypto, fs, mime;
  fs = require('fs');
  crypto = require('crypto');
  mime = require('mime');
  Environment = (function() {
    function Environment() {}
    /*
      # Mmm, CoffeeScript
      register_engine '.coffee', Tilt::CoffeeScriptTemplate
    
      # JST engines
      register_engine '.jst',    JstProcessor
      register_engine '.eco',    EcoTemplate
      register_engine '.ejs',    EjsTemplate
    
      # CSS engines
      register_engine '.less',   Tilt::LessTemplate
      register_engine '.sass',   Tilt::SassTemplate
      register_engine '.scss',   Tilt::ScssTemplate
    
      # Other
      register_engine '.erb',    Tilt::ERBTemplate
      register_engine '.str',    Tilt::StringTemplate
      */
    return Environment;
  })();
  module.exports = Environment;
}).call(this);
