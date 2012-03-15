var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Application.Configuration = (function(_super) {

  __extends(Configuration, _super);

  function Configuration() {
    Configuration.__super__.constructor.apply(this, arguments);
  }

  Configuration.include(Tower.Support.Callbacks);

  Configuration.before("initialize", "addLoadPaths");

  Configuration.before("initialize", "addAutoloadPaths");

  Configuration.before("initialize", "addRoutingPaths");

  Configuration.before("initialize", "addLocalePaths");

  Configuration.before("initialize", "addViewPaths");

  Configuration.before("initialize", "addHelperPaths");

  Configuration.before("initialize", "addAssetPaths");

  Configuration.before("initialize", "addConfigPaths");

  Configuration.before("initialize", "loadInitializers");

  Configuration.prototype.addRoutingPaths = function() {
    var config, configs, key, path, paths, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _len6, _m, _n, _ref, _ref2, _results;
    _ref = this.constructor.configNames;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      config = null;
      try {
        config = require("" + Tower.root + "/config/" + key);
      } catch (error) {
        config = {};
      }
      if (Tower.Support.Object.isPresent(config)) Tower.config[key] = config;
    }
    Tower.Application.Assets.loadManifest();
    paths = File.files("" + Tower.root + "/config/locales");
    for (_j = 0, _len2 = paths.length; _j < _len2; _j++) {
      path = paths[_j];
      if (path.match(/\.(coffee|js)$/)) Tower.Support.I18n.load(path);
    }
    require("" + Tower.root + "/config/environments/" + Tower.env);
    paths = File.files("" + Tower.root + "/config/initializers");
    for (_k = 0, _len3 = paths.length; _k < _len3; _k++) {
      path = paths[_k];
      if (path.match(/\.(coffee|js)$/)) require(path);
    }
    configs = this.constructor.initializers();
    for (_l = 0, _len4 = configs.length; _l < _len4; _l++) {
      config = configs[_l];
      config.call(this);
    }
    paths = File.files("" + Tower.root + "/app/helpers");
    paths = paths.concat(File.files("" + Tower.root + "/app/models"));
    paths = paths.concat(["" + Tower.root + "/app/controllers/applicationController"]);
    _ref2 = ["controllers", "mailers", "observers", "presenters", "middleware"];
    for (_m = 0, _len5 = _ref2.length; _m < _len5; _m++) {
      path = _ref2[_m];
      paths = paths.concat(File.files("" + Tower.root + "/app/" + path));
    }
    _results = [];
    for (_n = 0, _len6 = paths.length; _n < _len6; _n++) {
      path = paths[_n];
      if (path.match(/\.(coffee|js)$/)) {
        _results.push(require(path));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  return Configuration;

})(Tower.Class);
