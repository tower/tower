
Tower.View.AssetHelper = {
  javascripts: function(source) {
    var manifest, path, paths, result, _i, _len;
    if (Tower.env === "production") {
      manifest = Tower.assetManifest;
      source = "" + source + ".js";
      if (manifest[source]) source = manifest[source];
      path = "/javascripts/" + source;
      if (Tower.assetHost) path = "" + Tower.assetHost + path;
      return this.javascriptTag(path);
    } else {
      paths = Tower.assets.javascripts[source];
      result = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        result.push(this.javascriptTag("/javascripts" + path + ".js"));
      }
      return result.join("");
    }
  },
  stylesheets: function(source) {
    var manifest, path, paths, result, _i, _len;
    if (Tower.env === "production") {
      manifest = Tower.assetManifest;
      source = "" + source + ".css";
      if (manifest[source]) source = manifest[source];
      path = "/stylesheets/" + source;
      if (Tower.assetHost) path = "" + Tower.assetHost + path;
      return this.stylesheetTag(path);
    } else {
      paths = Tower.assets.stylesheets[source];
      result = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        result.push(this.stylesheetTag("/stylesheets" + path + ".css"));
      }
      return result.join("");
    }
  }
};

module.exports = Tower.View.AssetHelper;
