var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Application.Configuration = (function(_super) {
  var Configuration;

  function Configuration() {
    return Configuration.__super__.constructor.apply(this, arguments);
  }

  Configuration = __extends(Configuration, _super);

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

  __defineProperty(Configuration,  "addRoutingPaths", function() {
    var config, configs, key, path, paths, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref, _ref1, _results;
    _ref = this.constructor.configNames;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      config = null;
      try {
        config = require("" + Tower.root + "/config/" + key);
      } catch (error) {
        config = {};
      }
      if (_.isPresent(config)) {
        Tower.config[key] = config;
      }
    }
    Tower.Application.Assets.loadManifest();
    paths = File.files("" + Tower.root + "/config/locales");
    for (_j = 0, _len1 = paths.length; _j < _len1; _j++) {
      path = paths[_j];
      if (path.match(/\.(coffee|js)$/)) {
        Tower.Support.I18n.load(path);
      }
    }
    require("" + Tower.root + "/config/environments/" + Tower.env);
    paths = File.files("" + Tower.root + "/config/initializers");
    for (_k = 0, _len2 = paths.length; _k < _len2; _k++) {
      path = paths[_k];
      if (path.match(/\.(coffee|js)$/)) {
        require(path);
      }
    }
    configs = this.constructor.initializers();
    for (_l = 0, _len3 = configs.length; _l < _len3; _l++) {
      config = configs[_l];
      config.call(this);
    }
    paths = File.files("" + Tower.root + "/app/helpers");
    paths = paths.concat(File.files("" + Tower.root + "/app/models"));
    paths = paths.concat(["" + Tower.root + "/app/controllers/applicationController"]);
    _ref1 = ["controllers", "mailers", "observers", "presenters", "middleware"];
    for (_m = 0, _len4 = _ref1.length; _m < _len4; _m++) {
      path = _ref1[_m];
      paths = paths.concat(File.files("" + Tower.root + "/app/" + path));
    }
    _results = [];
    for (_n = 0, _len5 = paths.length; _n < _len5; _n++) {
      path = paths[_n];
      if (path.match(/\.(coffee|js)$/)) {
        _results.push(require(path));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  });

  return Configuration;

})(Tower.Class);
