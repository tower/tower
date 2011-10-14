(function() {
  var Model, exports, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  _ = require("underscore");
  _.mixin(require("underscore.string"));
  Model = (function() {
    __extends(Model, Class);
    function Model() {
      Model.__super__.constructor.apply(this, arguments);
    }
    Model.bootstrap = function() {
      var file, files, klass, _i, _len, _results;
      files = require('findit').sync("" + Metro.root + "/app/models");
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        klass = Metro.Asset.File.basename(file).split(".")[0];
        klass = _.camelize("_" + klass);
        _results.push(global[klass] = require(file));
      }
      return _results;
    };
    return Model;
  })();
  exports = module.exports = Model;
}).call(this);
