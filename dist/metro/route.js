(function() {
  var __slice = Array.prototype.slice;

  Metro.Route = (function() {

    Route.include(Metro.Model.Scopes);

    Route.store = function() {
      return this._store || (this._store = new Metro.Store.Memory);
    };

    Route.create = function(route) {
      return this.store().create(route);
    };

    Route.normalizePath = function(path) {
      return "/" + path.replace(/^\/|\/$/, "");
    };

    Route.initialize = function() {
      return require("" + Metro.root + "/config/routes");
    };

    Route.teardown = function() {
      this._store = [];
      delete require.cache[require.resolve("" + Metro.root + "/config/routes")];
      return delete this._store;
    };

    Route.reload = function() {
      this.teardown();
      return this.initialize();
    };

    Route.draw = function(callback) {
      callback.apply(new Metro.Route.DSL(this));
      return this;
    };

    function Route(options) {
      options || (options = options);
      this.path = options.path;
      this.name = options.name;
      this.method = options.method;
      this.ip = options.ip;
      this.defaults = options.defaults || {};
      this.constraints = options.constraints;
      this.options = options;
      this.controller = options.controller;
      this.keys = [];
      this.pattern = this.extractPattern(this.path);
      this.id = this.path;
      if (this.controller) {
        this.id += this.controller.name + this.controller.action;
      }
    }

    Route.prototype.match = function(path) {
      return this.pattern.exec(path);
    };

    Route.prototype.extractPattern = function(path, caseSensitive, strict) {
      var self;
      if (path instanceof RegExp) return path;
      self = this;
      if (path === "/") return new RegExp('^' + path + '$');
      path = path.replace(/(\(?)(\/)?(\.)?([:\*])(\w+)(\))?(\?)?/g, function(_, open, slash, format, symbol, key, close, optional) {
        var result, splat;
        optional = (!!optional) || (open + close === "()");
        splat = symbol === "*";
        self.keys.push({
          name: key,
          optional: !!optional,
          splat: splat
        });
        slash || (slash = "");
        result = "";
        if (!optional || !splat) result += slash;
        result += "(?:";
        if (format != null) {
          result += splat ? "\\.([^.]+?)" : "\\.([^/.]+?)";
        } else {
          result += splat ? "/?(.+)" : "([^/\\.]+)";
        }
        result += ")";
        if (optional) result += "?";
        return result;
      });
      return new RegExp('^' + path + '$', !!caseSensitive ? '' : 'i');
    };

    return Route;

  })();

  /*
  * Metro.Route.DSL
  */

  Metro.Route.DSL = (function() {

    function DSL() {}

    DSL.prototype.match = function() {
      this.scope || (this.scope = {});
      return Metro.Route.create(new Metro.Route(this._extractOptions.apply(this, arguments)));
    };

    DSL.prototype.get = function() {
      return this.matchMethod.apply(this, ["get"].concat(__slice.call(arguments)));
    };

    DSL.prototype.post = function() {
      return this.matchMethod.apply(this, ["post"].concat(__slice.call(arguments)));
    };

    DSL.prototype.put = function() {
      return this.matchMethod.apply(this, ["put"].concat(__slice.call(arguments)));
    };

    DSL.prototype["delete"] = function() {
      return this.matchMethod.apply(this, ["delete"].concat(__slice.call(arguments)));
    };

    DSL.prototype.matchMethod = function(method) {
      var options;
      options = arguments.pop();
      options.via = method;
      arguments.push(options);
      this.match(options);
      return this;
    };

    DSL.prototype.scope = function() {};

    DSL.prototype.controller = function(controller, options, block) {
      options.controller = controller;
      return this.scope(options, block);
    };

    /*
      * Scopes routes to a specific namespace. For example:
      * 
      * ```coffeescript
      * namespace "admin", ->
      *   resources "posts"
      * ```
      * 
      * This generates the following routes:
      * 
      *       adminPosts GET    /admin/posts(.:format)          admin/posts#index
      *       adminPosts POST   /admin/posts(.:format)          admin/posts#create
      *    newAdminPost GET    /admin/posts/new(.:format)      admin/posts#new
      *   editAdminPost GET    /admin/posts/:id/edit(.:format) admin/posts#edit
      *        adminPost GET    /admin/posts/:id(.:format)      admin/posts#show
      *        adminPost PUT    /admin/posts/:id(.:format)      admin/posts#update
      *        adminPost DELETE /admin/posts/:id(.:format)      admin/posts#destroy
      * 
      * ## Options
      * 
      * The +:path+, +:as+, +:module+, +:shallowPath+ and +:shallowPrefix+
      * options all default to the name of the namespace.
      * 
      * For options, see <tt>Base#match</tt>. For +:shallowPath+ option, see
      * <tt>Resources#resources</tt>.
      * 
      * ## Examples
      * 
      * ``` coffeescript
      * # accessible through /sekret/posts rather than /admin/posts
      * namespace "admin", path: "sekret", ->
      *   resources "posts"
      * 
      * # maps to <tt>Sekret::PostsController</tt> rather than <tt>Admin::PostsController</tt>
      * namespace "admin", module: "sekret", ->
      *   resources "posts"
      * 
      * # generates +sekretPostsPath+ rather than +adminPostsPath+
      * namespace "admin", as: "sekret", ->
      *   resources "posts"
      * ```
      * 
      * @param {String} path
    */

    DSL.prototype.namespace = function(path, options, block) {
      options = _.extend({
        path: path,
        as: path,
        module: path,
        shallowPath: path,
        shallowPrefix: path
      }, options);
      return this.scope(options, block);
    };

    DSL.prototype.constraints = function(options, block) {
      return this.scope({
        constraints: options
      }, block);
    };

    DSL.prototype.defaults = function(options, block) {
      return this.scope({
        defaults: options
      }, block);
    };

    DSL.prototype.resource = function() {};

    DSL.prototype.resources = function() {};

    DSL.prototype.collection = function() {};

    DSL.prototype.member = function() {};

    DSL.prototype.root = function(options) {
      return this.match('/', _.extend({
        as: "root"
      }, options));
    };

    DSL.prototype._extractOptions = function() {
      var anchor, constraints, controller, defaults, format, method, name, options, path;
      path = Metro.Route.normalizePath(arguments[0]);
      options = arguments[arguments.length - 1] || {};
      options.path = path;
      format = this._extractFormat(options);
      options.path = this._extractPath(options);
      method = this._extractRequestMethod(options);
      constraints = this._extractConstraints(options);
      defaults = this._extractDefaults(options);
      controller = this._extractController(options);
      anchor = this._extractAnchor(options);
      name = this._extractName(options);
      options = _.extend(options, {
        method: method,
        constraints: constraints,
        defaults: defaults,
        name: name,
        format: format,
        controller: controller,
        anchor: anchor,
        ip: options.ip
      });
      return options;
    };

    DSL.prototype._extractFormat = function(options) {};

    DSL.prototype._extractName = function(options) {
      return options.as;
    };

    DSL.prototype._extractConstraints = function(options) {
      return options.constraints || {};
    };

    DSL.prototype._extractDefaults = function(options) {
      return options.defaults || {};
    };

    DSL.prototype._extractPath = function(options) {
      return "" + options.path + ".:format?";
    };

    DSL.prototype._extractRequestMethod = function(options) {
      return options.via || options.requestMethod;
    };

    DSL.prototype._extractAnchor = function(options) {
      return options.anchor;
    };

    DSL.prototype._extractController = function(options) {
      var action, controller, to;
      to = options.to.split('#');
      if (to.length === 1) {
        action = to[0];
      } else {
        controller = to[0];
        action = to[1];
      }
      controller || (controller = options.controller || this.scope.controller);
      action || (action = options.action || this.scope.action);
      controller = controller.toLowerCase().replace(/(?:[cC]ontroller)?$/, "Controller");
      action = action.toLowerCase();
      return {
        name: controller,
        action: action,
        className: _.camelize("_" + controller)
      };
    };

    return DSL;

  })();

  Metro.Route.Url = (function() {

    Url.key = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "fragment"];

    Url.aliases = {
      anchor: "fragment"
    };

    Url.parser = {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    };

    Url.querystring_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g;

    Url.fragment_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g;

    Url.type_parser = /(youtube|vimeo|eventbrite)/;

    Url.parse = function(string, strictMode) {
      var i, key, res, type, url;
      key = Url.key;
      string = decodeURI(string);
      res = Url.parser[(strictMode || false ? "strict" : "loose")].exec(string);
      url = {
        attr: {},
        param: {},
        seg: {}
      };
      i = 14;
      while (i--) {
        url.attr[key[i]] = res[i] || "";
      }
      url.param["query"] = {};
      url.param["fragment"] = {};
      url.attr["query"].replace(Url.querystring_parser, function($0, $1, $2) {
        if ($1) return url.param["query"][$1] = $2;
      });
      url.attr["fragment"].replace(Url.fragment_parser, function($0, $1, $2) {
        if ($1) return url.param["fragment"][$1] = $2;
      });
      url.seg["path"] = url.attr.path.replace(/^\/+|\/+$/g, "").split("/");
      url.seg["fragment"] = url.attr.fragment.replace(/^\/+|\/+$/g, "").split("/");
      url.attr["base"] = (url.attr.host ? url.attr.protocol + "://" + url.attr.host + (url.attr.port ? ":" + url.attr.port : "") : "");
      type = Url.type_parser.exec(url.attr.host);
      if (type) url.attr["type"] = type[0];
      return url;
    };

    function Url(url, strictMode) {
      if (typeof url === "object") {
        this.data = url;
      } else {
        if (arguments.length === 1 && url === true) {
          strictMode = true;
          url = void 0;
        }
        this.strictMode = strictMode || false;
        url = url;
        if (typeof window !== "undefined" && window !== null) {
          if (url == null) url = window.location.toString();
        }
        this.data = Url.parse(url, strictMode);
      }
    }

    Url.prototype.attr = function(attr) {
      attr = Url.aliases[attr] || attr;
      if (attr !== void 0) {
        return this.data.attr[attr];
      } else {
        return this.data.attr;
      }
    };

    Url.prototype.param = function(param) {
      if (param !== void 0) {
        return this.data.param.query[param];
      } else {
        return this.data.param.query;
      }
    };

    Url.prototype.fparam = function(param) {
      if (param !== void 0) {
        return this.data.param.fragment[param];
      } else {
        return this.data.param.fragment;
      }
    };

    Url.prototype.segment = function(seg) {
      if (seg === void 0) {
        return this.data.seg.path;
      } else {
        seg = (seg < 0 ? this.data.seg.path.length + seg : seg - 1);
        return this.data.seg.path[seg];
      }
    };

    Url.prototype.fsegment = function(seg) {
      if (seg === void 0) {
        return this.data.seg.fragment;
      } else {
        seg = (seg < 0 ? this.data.seg.fragment.length + seg : seg - 1);
        return this.data.seg.fragment[seg];
      }
    };

    return Url;

  })();

}).call(this);
