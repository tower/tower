
  Metro.Net.Route.DSL = (function() {

    function DSL() {
      this._scope = {};
    }

    DSL.prototype.match = function() {
      this.scope || (this.scope = {});
      return Metro.Net.Route.create(new Metro.Net.Route(this._extractOptions.apply(this, arguments)));
    };

    DSL.prototype.get = function() {
      return this.matchMethod("get", Metro.Support.Array.args(arguments));
    };

    DSL.prototype.post = function() {
      return this.matchMethod("post", Metro.Support.Array.args(arguments));
    };

    DSL.prototype.put = function() {
      return this.matchMethod("put", Metro.Support.Array.args(arguments));
    };

    DSL.prototype["delete"] = function() {
      return this.matchMethod("delete", Metro.Support.Array.args(arguments));
    };

    DSL.prototype.matchMethod = function(method, args) {
      var name, options, path;
      if (typeof args[args.length - 1] === "object") {
        options = args.pop();
      } else {
        options = {};
      }
      name = args.shift();
      options.method = method;
      options.action = name;
      options.name = name;
      if (this._scope.name) {
        options.name = this._scope.name + Metro.Support.String.camelize(options.name);
      }
      path = "/" + name;
      if (this._scope.path) path = this._scope.path + path;
      this.match(path, options);
      return this;
    };

    DSL.prototype.scope = function(options, block) {
      var originalScope;
      if (options == null) options = {};
      originalScope = this._scope || (this._scope = {});
      this._scope = Metro.Support.Object.extend({}, originalScope, options);
      block.call(this);
      this._scope = originalScope;
      return this;
    };

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
      if (typeof options === 'function') {
        block = options;
        options = {};
      } else {
        options = {};
      }
      options = Metro.Support.Object.extend({
        name: path,
        path: path,
        as: path,
        module: path,
        shallowPath: path,
        shallowPrefix: path
      }, options);
      if (options.name && this._scope.name) {
        options.name = this._scope.name + Metro.Support.String.camelize(options.name);
      }
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

    DSL.prototype.resource = function(name, options) {
      if (options == null) options = {};
      options.controller = name;
      this.match("" + name + "/new", Metro.Support.Object.extend({
        action: "new"
      }, options));
      this.match("" + name, Metro.Support.Object.extend({
        action: "create",
        method: "POST"
      }, options));
      this.match("" + name + "/", Metro.Support.Object.extend({
        action: "show"
      }, options));
      this.match("" + name + "/edit", Metro.Support.Object.extend({
        action: "edit"
      }, options));
      this.match("" + name, Metro.Support.Object.extend({
        action: "update",
        method: "PUT"
      }, options));
      return this.match("" + name, Metro.Support.Object.extend({
        action: "destroy",
        method: "DELETE"
      }, options));
    };

    DSL.prototype.resources = function(name, options, callback) {
      var many, one, path;
      if (typeof options === 'function') {
        callback = options;
        options = {};
      } else {
        options = {};
      }
      options.controller || (options.controller = name);
      path = "/" + name;
      if (this._scope.path) path = this._scope.path + path;
      if (this._scope.name) {
        many = this._scope.name + Metro.Support.String.camelize(name);
      } else {
        many = name;
      }
      one = Metro.Support.String.singularize(many);
      this.match("" + path, Metro.Support.Object.extend({
        name: "" + many,
        action: "index"
      }, options));
      this.match("" + path + "/new", Metro.Support.Object.extend({
        name: "new" + (Metro.Support.String.camelize(one)),
        action: "new"
      }, options));
      this.match("" + path, Metro.Support.Object.extend({
        action: "create",
        method: "POST"
      }, options));
      this.match("" + path + "/:id", Metro.Support.Object.extend({
        name: "" + one,
        action: "show"
      }, options));
      this.match("" + path + "/:id/edit", Metro.Support.Object.extend({
        name: "edit" + (Metro.Support.String.camelize(one)),
        action: "edit"
      }, options));
      this.match("" + path + "/:id", Metro.Support.Object.extend({
        action: "update",
        method: "PUT"
      }, options));
      this.match("" + path + "/:id", Metro.Support.Object.extend({
        action: "destroy",
        method: "DELETE"
      }, options));
      if (callback) {
        this.scope(Metro.Support.Object.extend({
          path: "" + path + "/:" + (Metro.Support.String.singularize(name)) + "Id",
          name: one
        }, options), callback);
      }
      return this;
    };

    DSL.prototype.collection = function() {};

    DSL.prototype.member = function() {};

    DSL.prototype.root = function(options) {
      return this.match('/', Metro.Support.Object.extend({
        as: "root"
      }, options));
    };

    DSL.prototype._extractOptions = function() {
      var anchor, args, constraints, controller, defaults, format, method, name, options, path;
      args = Metro.Support.Array.args(arguments);
      path = "/" + args.shift().replace(/^\/|\/$/, "");
      if (typeof args[args.length - 1] === "object") {
        options = args.pop();
      } else {
        options = {};
      }
      if (args.length > 0) options.to || (options.to = args.shift());
      options.path = path;
      format = this._extractFormat(options);
      options.path = this._extractPath(options);
      method = this._extractRequestMethod(options);
      constraints = this._extractConstraints(options);
      defaults = this._extractDefaults(options);
      controller = this._extractController(options);
      anchor = this._extractAnchor(options);
      name = this._extractName(options);
      options = Metro.Support.Object.extend(options, {
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
      return options.as || options.name;
    };

    DSL.prototype._extractConstraints = function(options) {
      return Metro.Support.Object.extend(this._scope.constraints || {}, options.constraints || {});
    };

    DSL.prototype._extractDefaults = function(options) {
      return options.defaults || {};
    };

    DSL.prototype._extractPath = function(options) {
      return "" + options.path + ".:format?";
    };

    DSL.prototype._extractRequestMethod = function(options) {
      return (options.method || options.via || "GET").toUpperCase();
    };

    DSL.prototype._extractAnchor = function(options) {
      return options.anchor;
    };

    DSL.prototype._extractController = function(options) {
      var action, controller, to;
      if (options == null) options = {};
      to = options.to;
      if (to) {
        to = to.split('#');
        if (to.length === 1) {
          action = to[0];
        } else {
          controller = to[0];
          action = to[1];
        }
      }
      controller || (controller = options.controller || this._scope.controller);
      action || (action = options.action);
      if (!controller) {
        throw new Error("No controller was specified for the route " + options.path);
      }
      controller = controller.toLowerCase().replace(/(?:[cC]ontroller)?$/, "Controller");
      return {
        name: controller,
        action: action,
        className: Metro.Support.String.camelize("" + controller)
      };
    };

    return DSL;

  })();

  module.exports = Metro.Route.DSL;
