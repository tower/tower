(function() {
  var Sprite;
  Sprite = (function() {
    function Sprite() {}
    Sprite.prototype.engine = function() {
      return require('imagemagick');
    };
    Sprite.prototype.render = function(options, callback) {
      return this.montage(options, callback);
    };
    Sprite.prototype.montage = function(options, callback) {
      var columns, gutter, images, output, rows, self, type;
      images = options.images;
      if (!(images && images.length > 0)) {
        throw new Error("you haven't specified any images");
      }
      columns = options.columns || 1;
      rows = images.length;
      type = options.type || "png";
      output = options.output || "sprite.png";
      gutter = options.gutter || 10;
      self = this;
      this.identify(images, function(data) {
        var command;
        if (data.length > 0) {
          command = "montage -background transparent -tile " + columns + "x" + rows + " -geometry +0+2 " + (images.join(" ")) + " " + output;
          return Metro.Support.System.run(command, function(error, stdout, stderr) {
            return callback.call(self, data);
          });
        }
      });
      return images;
    };
    Sprite.prototype.identify = function(images, callback) {
      var data, engine, image, self, _i, _len;
      data = [];
      self = this;
      engine = this.engine();
      for (_i = 0, _len = images.length; _i < _len; _i++) {
        image = images[_i];
        engine.identify(image, function(error, features) {
          features.path = image;
          features.slug = Metro.Support.File.slug(image);
          data.push(features);
          if (data.length === images.length) {
            return callback.call(self, data);
          }
        });
      }
      return images;
    };
    return Sprite;
  })();
  module.exports = Sprite;
}).call(this);
