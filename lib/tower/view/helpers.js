
  Tower.View.Helpers = {
    titleTag: function(title) {
      return "<title>" + title + "</title>";
    },
    metaTag: function(name, content) {
      return "<meta name=\"" + name + "\" content=\"" + content + "\"/>";
    },
    tag: function(name, options) {},
    linkTag: function(title, path, options) {},
    imageTag: function(path, options) {},
    csrfMetaTag: function() {
      return this.metaTag("csrf-token", this.request.session._csrf);
    },
    contentTypeTag: function(type) {
      if (type == null) type = "UTF-8";
      return "<meta charset=\"" + type + "\" />";
    },
    javascriptTag: function(path) {
      return "<script type=\"text/javascript\" src=\"" + path + "\" ></script>";
    },
    stylesheetTag: function(path) {
      return "<link href=\"" + path + "\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\"/>";
    },
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
    },
    t: function(string) {
      return Tower.translate(string);
    },
    l: function(object) {
      return Tower.localize(string);
    }
  };

  module.exports = Tower.View.Helpers;
