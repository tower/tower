var __slice = Array.prototype.slice;

Tower.View.AssetHelper = {
  javascripts: function() {
    var options, path, paths, sources, _i, _len;
    sources = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    options = Tower.Support.Array.extractOptions(sources);
    options.namespace = "javascripts";
    options.extension = "js";
    paths = this._extractAssetPaths(sources, options);
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      javascriptTag(path);
    }
    return null;
  },
  javascript: function() {
    return javascript.apply(this, arguments);
  },
  stylesheets: function() {
    var options, path, paths, sources, _i, _len;
    sources = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    options = Tower.Support.Array.extractOptions(sources);
    options.namespace = "stylesheets";
    options.extension = "css";
    paths = this._extractAssetPaths(sources, options);
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      stylesheetTag(path);
    }
    return null;
  },
  stylesheet: function() {
    return stylesheets.apply(this, arguments);
  },
  _extractAssetPaths: function(sources, options) {
    var extension, manifest, namespace, path, paths, result, source, _i, _j, _k, _len, _len2, _len3;
    if (options == null) options = {};
    namespace = options.namespace;
    extension = options.extension;
    result = [];
    if (Tower.env === "production") {
      manifest = Tower.assetManifest;
      for (_i = 0, _len = sources.length; _i < _len; _i++) {
        source = sources[_i];
        if (!source.match(/^(http|\/{2})/)) {
          source = "" + source + "." + extension;
          if (manifest[source]) source = manifest[source];
          source = "/" + namespace + "/" + source;
          if (Tower.assetHost) source = "" + Tower.assetHost + source;
        }
        result.push(source);
      }
    } else {
      for (_j = 0, _len2 = sources.length; _j < _len2; _j++) {
        source = sources[_j];
        if (!!source.match(/^(http|\/{2})/)) {
          result.push(source);
        } else {
          paths = Tower.assets[namespace][source];
          for (_k = 0, _len3 = paths.length; _k < _len3; _k++) {
            path = paths[_k];
            result.push("/" + namespace + path + "." + extension);
          }
        }
      }
    }
    return result;
  },
  stylesheetTag: function(source) {
    return link({
      rel: 'stylesheet',
      href: source
    });
  },
  javascriptTag: function(source) {
    return script({
      src: source
    });
  }
};

module.exports = Tower.View.AssetHelper;
