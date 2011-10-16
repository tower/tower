(function() {
  var Route, exports;
  Route = (function() {
    Route.normalize_path = function(path) {
      return "/" + path.replace(/^\/|\/$/, "");
    };
    Route.prototype.name = null;
    Route.prototype.path = null;
    Route.prototype.ip = null;
    Route.prototype.method = "get";
    Route.prototype.options = {};
    Route.prototype.pattern = /(?:)/;
    Route.prototype.segments = [];
    Route.prototype.keys = [];
    function Route(options) {
      if (options == null) {
        options = options;
      }
      this.path = options.path;
      this.name = options.name;
      this.method = options.method || "get";
      this.ip = options.ip;
      this.options = options;
      this.pattern = this.extract_pattern(this.path);
    }
    Route.prototype.match = function(path) {
      return this.pattern.exec(path);
    };
    Route.prototype.extract_pattern = function(path, case_sensitive, strict) {
      var self, _ref;
      if (path instanceof RegExp) {
        return path;
      }
      self = this;
      path = path.concat((!!strict ? "" : "/?")).replace(/\/\(/g, "(?:/").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional) {
        self.keys.push({
          name: key,
          optional: !!optional
        });
        slash = slash || "";
        return "" + (optional ? "" : slash) + "(?:" + (optional ? slash : "") + (format || "") + (capture || (format && "([^/.]+?)" || "([^/]+?)")) + ")" + (optional || "");
      }).replace(/([\/.])/g, "\\$1").replace(/(\()?\/\*([^\)\/]*)\)?(\/)?/g, function(_, optional, key, slash) {
        self.keys.push({
          name: key,
          optional: !!optional
        });
        slash = slash || "";
        return "" + (optional ? "" : slash) + "(?:" + (optional ? slash : "") + "(.*))";
      });
      return new RegExp('^' + path + '$', (_ref = !!case_sensitive) != null ? _ref : {
        '': 'i'
      });
    };
    return Route;
  })();
  exports = module.exports = Route;
}).call(this);
