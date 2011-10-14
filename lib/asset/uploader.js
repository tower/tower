(function() {
  var Uplaoder, exports;
  Uplaoder = (function() {
    Uplaoder.prototype.client = null;
    /*
      uploader = new Metro.Uploader "s3",
        key: '<api-key-here>'
        secret: '<secret-here>'
        bucket: 'learnboost'
      */
    function Uplaoder(options) {
      this.client = knox.createClient({
        key: '<api-key-here>',
        secret: '<secret-here>',
        bucket: 'learnboost'
      });
    }
    Uplaoder.prototype.upload = function(from, to, callback) {
      return this.client().putFile(from, to, callback);
    };
    Uplaoder.prototype.update = function(remote, options) {
      return this.client().put(remote, options);
    };
    return Uplaoder;
  })();
  exports = module.exports = Uplaoder;
}).call(this);
