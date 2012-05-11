Tower.View.AssetHelper = {
  javascripts: function() {
    var options, path, paths, sources, _i, _len;
    sources = _.args(arguments);
    options = _.extractOptions(sources);
    options.namespace = "javascripts";
    options.extension = "js";
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
    options.namespace = "stylesheets";
    options.extension = "css";
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
    var extension, manifest, namespace, path, paths, result, source, _i, _j, _k, _len, _len1, _len2;
    if (options == null) {
      options = {};
    }
    namespace = options.namespace;
    extension = options.extension;
    result = [];
    if (Tower.env === "production") {
      manifest = Tower.assetManifest;
      for (_i = 0, _len = sources.length; _i < _len; _i++) {
        source = sources[_i];
        if (!source.match(/^(http|\/{2})/)) {
          source = "" + source + "." + extension;
          if (manifest[source]) {
            source = manifest[source];
          }
          if (Tower.assetHost) {
            if (Tower.assetHost.match(/^https?:\/{2}s3\./)) {
            	switch(source.match(/[^\.]+$/)[0]) {
            		case 'css':
		          		source = "/stylesheets/" + source;
		          		break;
		          		
		          	case 'js':
		          		source = "/javascripts/" + source;
		          		break;
		          		
		          	case 'jpg':
		          	case 'gif':
		          	case 'png':
		          		source = "/images/" + source;
		          		break;
		          		
		          	default:
		          		source = "/assets/" + source;
		          		break;
		          }
          	}
            source = "" + Tower.assetHost + source;
          }
          else {
          	source = "/assets/" + source;
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
          paths = Tower.config.assets[namespace][source];
          if (paths) {
            for (_k = 0, _len2 = paths.length; _k < _len2; _k++) {
              path = paths[_k];
              result.push("/" + namespace + path + "." + extension);
            }
          }
        }
      }
    }
    return result;
  }
};

module.exports = Tower.View.AssetHelper;
