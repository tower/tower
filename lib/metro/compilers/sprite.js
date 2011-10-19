(function() {
  var Sprite, _;
  _ = require('underscore');
  Sprite = (function() {
    function Sprite() {}
    Sprite.prototype.engine = function() {
      return require('imagemagick');
    };
    Sprite.prototype.render = function(options, callback) {
      var self;
      self = this;
      return this.montage(options, function(data) {
        return callback(self["to_" + (options.format || 'css')](data, options));
      });
    };
    Sprite.prototype.to_stylus = function(data, options) {
      var i, item, result, _if, _len;
      result = "" + (options.name || 'sprite') + "(slug, x, y)\n";
      for (i = 0, _len = data.length; i < _len; i++) {
        item = data[i];
        _if = i === 0 ? "if" : (i === data.length - 1 ? "else" : "else if");
        result += "  " + _if + " slug == \"" + item.slug + "\"\n";
        result += "    background: url(" + item.path + ") " + (item.x || 0) + "px " + (item.y || 0) + "px no-repeat;\n";
      }
      return result;
    };
    Sprite.prototype.to_css = function(data, options) {
      var i, item, name, result, _len;
      result = "";
      name = options.name || "sprite";
      for (i = 0, _len = data.length; i < _len; i++) {
        item = data[i];
        result += "\." + item.slug + "-" + name + " {\n";
        result += "  background: url(" + item.path + ") " + (item.x || 0) + "px " + (item.y || 0) + "px no-repeat;\n";
        result += "}\n";
      }
      return result;
    };
    Sprite.prototype.montage = function(options, callback) {
      var columns, images, offset, output, rows, self, type, _ref, _ref2;
      images = options.images;
      if (!(images && images.length > 0)) {
        throw new Error("you haven't specified any images");
      }
      columns = options.columns || 1;
      rows = images.length;
      type = options.type || "png";
      output = options.output || "sprite.png";
      offset = options.offset || {};
      if ((_ref = offset.x) == null) {
        offset.x = 0;
      }
      if ((_ref2 = offset.y) == null) {
        offset.y = 5;
      }
      self = this;
      this.identifyAll(images, offset, function(data) {
        var command;
        if (data.length > 0) {
          command = "montage -background transparent -tile " + columns + "x" + rows + " -geometry +" + offset.x + "+" + offset.y + " -frame 4x4 " + (images.join(" ")) + " " + output;
          return Metro.Support.System.command(command, function(error, stdout, stderr) {
            return callback.call(self, data);
          });
        }
      });
      return images;
    };
    Sprite.prototype.identifyAll = function(images, offset, callback) {
      var cumulative_offset, data, image, _i, _len;
      data = [];
      cumulative_offset = {
        x: 0,
        y: 0
      };
      for (_i = 0, _len = images.length; _i < _len; _i++) {
        image = images[_i];
        this.identify(image, images, data, function(data) {
          var item, _j, _len2;
          for (_j = 0, _len2 = data.length; _j < _len2; _j++) {
            item = data[_j];
            item.y = cumulative_offset.y + offset.y;
            offset.y += item.height;
          }
          return callback(data);
        });
      }
      return null;
    };
    Sprite.prototype.identify = function(image, images, data, callback) {
      var self;
      self = this;
      return this.engine().identify(image, function(error, features) {
        features.path = image;
        features.slug = Metro.Support.File.slug(image);
        features.format = features.format.toLowerCase();
        data[images.indexOf(image)] = features;
        if (data.length === images.length) {
          return callback.call(self, data);
        }
      });
    };
    return Sprite;
  })();
  module.exports = Sprite;
}).call(this);
