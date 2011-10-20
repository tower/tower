(function() {
  var S3;
  S3 = (function() {
    S3.prototype.authenticate = function(options) {};
    S3.prototype.put = function() {};
    S3.prototype.post = function() {};
    S3.prototype.get = function() {};
    S3.prototype.put_file = function() {};
    S3.prototype.post_file = function() {};
    /*
      uploader = new Metro.Uploader "s3",
        key: '<api-key-here>'
        secret: '<secret-here>'
        bucket: 'learnboost'
      */
    function S3(options) {
      this.client = require("knox").createClient({
        key: options.key,
        secret: options.secret,
        bucket: options.bucket
      });
    }
    S3.prototype.upload = function(from, to, callback) {
      return this.client.putFile(from, to, callback);
    };
    S3.prototype.update = function(remote, options) {
      return this.client.put(remote, options);
    };
    return S3;
  })();
  module.exports = S3;
}).call(this);
