(function() {
  var Environment, crypto, exports, fs, mime;
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
    Environment.prototype.stat = function(path) {
      return fs.statSync(path);
    };
    /*
      see http://nodejs.org/docs/v0.3.1/api/crypto.html#crypto
      */
    Environment.prototype.digest = function() {
      return crypto.createHash('md5');
    };
    Environment.prototype.digest_file = function(path, data) {
      var stat;
      stat = this.stat(path);
      if (stat == null) {
        return;
      }
      if (data == null) {
        data = this.read_file(path);
      }
      if (data == null) {
        return;
      }
      return this.digest().update(data).digest("hex");
    };
    Environment.prototype.read_file = function(path) {
      return fs.readFileSync(path);
    };
    Environment.prototype.content_type = function(path) {
      return mime.lookup(path);
    };
    Environment.prototype.mtime = function(path) {
      return this.stat(path).mtime;
    };
    return Environment;
  })();
  exports = module.exports = Environment;
}).call(this);
