(function() {
  var Image;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Image = (function() {
    __extends(Image, Metro.Assets.Asset);
    function Image() {
      Image.__super__.constructor.apply(this, arguments);
    }
    Image.prototype.engine = function() {
      return require('imagemagick');
    };
    Image.prototype.render = function(options) {
      this.engine().readMetadata(options.path, function(err, metadata) {});
      if (typeof err !== "undefined" && err !== null) {
        throw err;
      }
      return console.log('Shot at ' + metadata.exif.dateTimeOriginal);
    };
    return Image;
  })();
  module.exports = Image;
}).call(this);
