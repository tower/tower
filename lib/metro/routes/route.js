(function() {
  var Route, exports;
  Route = (function() {
    Route.normalize_path = function(path) {
      return "/" + path.replace(/^\/|\/$/, "");
    };
    Route.prototype.name = null;
    Route.prototype.path = null;
    Route.prototype.ip = null;
    Route.prototype.method = null;
    Route.prototype.options = null;
    Route.prototype.pattern = null;
    Route.prototype.keys = null;
    function Route(options) {
      if (options == null) {
        options = options;
      }
      this.path = options.path;
      this.name = options.name;
      this.method = options.method;
      this.ip = options.ip;
      this.defaults = options.defaults || {};
      this.constraints = options.constraints;
      this.options = options;
      this.controller = options.controller;
      this.keys = [];
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
      path = path.replace(/(\(?)(\/)?(\.)?([:\*])(\w+)(\))?(\?)?/g, function(_, open, slash, format, symbol, key, close, optional) {
        var result, splat;
        optional = (!!optional) || (open + close === "()");
        splat = symbol === "*";
        self.keys.push({
          name: key,
          optional: !!optional,
          splat: splat
        });
        if (slash == null) {
          slash = "";
        }
        result = "";
        if (!optional) {
          result += slash;
        }
        result += "(?:";
        if (optional) {
          result += slash;
        }
        if (format != null) {
          result += format;
          result += splat ? "([^.]+?)" : "([^/.]+?)";
        } else {
          result += splat ? "(.+?)" : "([^/]+?)";
        }
        result += ")";
        if (optional) {
          result += "?";
        }
        return result;
      });
      return new RegExp('^' + path + '$', (_ref = !!case_sensitive) != null ? _ref : {
        '': 'i'
      });
    };
    return Route;
  })();
  exports = module.exports = Route;
}).call(this);
