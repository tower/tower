(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.View = (function() {

    __extends(View, Metro.Object);

    View.extend({
      loadPaths: ["./app/views"],
      paths: [],
      pathsByName: {},
      engine: "jade",
      prettyPrint: false,
      store: function(store) {
        if (store) this._store = store;
        return this._store || (this._store = new Metro.Store.FileSystem);
      }
    });

    function View(controller) {
      this.controller = controller || (new Metro.Controller);
    }

    View.prototype.store = function() {
      return this.constructor.store();
    };

    return View;

  })();

  Metro.View.Helpers = {
    contentTypeTag: function(type) {
      if (type == null) type = "UTF-8";
      return "\n    <meta charset=\"" + type + "\" />";
    },
    t: function(string) {
      return Metro.translate(string);
    },
    javascriptTag: function(path) {
      return "\n    <script type=\"text/javascript\" src=\"" + path + "\" ></script>";
    },
    stylesheetTag: function(path) {
      return "\n    <link href=\"" + path + "\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\"/>";
    },
    javascripts: function(source) {
      var manifest, path, paths, result, _i, _len;
      if (Metro.env === "production") {
        manifest = Metro.assetManifest;
        source = "" + source + ".js";
        if (manifest[source]) source = manifest[source];
        path = "/javascripts/" + source;
        if (Metro.assetHost) path = "" + Metro.assetHost + path;
        return this.javascriptTag(path);
      } else {
        paths = Metro.assets.javascripts[source];
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
      if (Metro.env === "production") {
        manifest = Metro.assetManifest;
        source = "" + source + ".css";
        if (manifest[source]) source = manifest[source];
        path = "/stylesheets/" + source;
        if (Metro.assetHost) path = "" + Metro.assetHost + path;
        return this.stylesheetTag(path);
      } else {
        paths = Metro.assets.stylesheets[source];
        result = [];
        for (_i = 0, _len = paths.length; _i < _len; _i++) {
          path = paths[_i];
          result.push(this.stylesheetTag("/stylesheets" + path + ".css"));
        }
        return result.join("");
      }
    },
    titleTag: function(title) {
      return "<title>" + title + "</title>";
    },
    metaTag: function(name, content) {},
    tag: function(name, options) {},
    linkTag: function(title, path, options) {},
    imageTag: function(path, options) {}
  };

}).call(this);
