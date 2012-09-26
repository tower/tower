var _;

_ = Tower._;

Tower.ViewAssetHelper = {
  javascripts: function() {
    var options, path, paths, sources, _i, _len;
    sources = _.args(arguments);
    options = _.extractOptions(sources);
    options.namespace = 'javascripts';
    options.extension = 'js';
    paths = _extractAssetPaths(sources, options);
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      javascriptTag(path);
    }
    return null;
  },
  javascript: function() {
    return javascripts.apply(this, arguments);
  },
  stylesheets: function() {
    var options, path, paths, sources, _i, _len;
    sources = _.args(arguments);
    options = _.extractOptions(sources);
    options.namespace = 'stylesheets';
    options.extension = 'css';
    paths = _extractAssetPaths(sources, options);
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      stylesheetTag(path);
    }
    return null;
  },
  stylesheet: function() {
    return stylesheets.apply(this, arguments);
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
  },
  _extractAssetPaths: function(sources, options) {
    var assets, extension, manifest, namespace, only, path, paths, result, source, _i, _j, _k, _len, _len1, _len2;
    if (options == null) {
      options = {};
    }
    namespace = options.namespace;
    extension = options.extension;
    assets = Tower.config.assets[namespace];
    result = [];
    if (Tower.env === 'production') {
      manifest = Tower.assetManifest;
      for (_i = 0, _len = sources.length; _i < _len; _i++) {
        source = sources[_i];
        if (!source.match(/^(http|\/{2})/)) {
          if (assets[source] == null) {
            continue;
          }
          source = "" + source + "." + extension;
          if (manifest[source]) {
            source = manifest[source];
          }
          source = "/" + namespace + "/" + source;
          if (Tower.assetHost) {
            source = "" + Tower.assetHost + source;
          }
        }
        result.push(source);
      }
    } else {
      for (_j = 0, _len1 = sources.length; _j < _len1; _j++) {
        source = sources[_j];
        if (!!source.match(/^(http|\/{2})/)) {
          result.push(source);
        } else {
          paths = assets[source];
          if (paths) {
            for (_k = 0, _len2 = paths.length; _k < _len2; _k++) {
              path = paths[_k];
              result.push("/" + namespace + path + "." + extension);
            }
          }
        }
      }
      only = options.only;
      if (_.isArray(only)) {
        only = new RegExp(only.join('|'));
      }
      if (_.isRegExp(only)) {
        result = _.select(result, function(source) {
          return !!source.match(only);
        });
      }
    }
    return result;
  }
};

module.exports = Tower.ViewAssetHelper;
