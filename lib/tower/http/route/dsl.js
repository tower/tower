
Tower.HTTP.Route.DSL = (function() {

  function DSL() {
    this._scope = {};
  }

  DSL.prototype.match = function() {
    this.scope || (this.scope = {});
    return Tower.HTTP.Route.create(new Tower.HTTP.Route(this._extractOptions.apply(this, arguments)));
  };

  DSL.prototype.get = function() {
    return this.matchMethod("get", Tower.Support.Array.args(arguments));
  };

  DSL.prototype.post = function() {
    return this.matchMethod("post", Tower.Support.Array.args(arguments));
  };

  DSL.prototype.put = function() {
    return this.matchMethod("put", Tower.Support.Array.args(arguments));
  };

  DSL.prototype["delete"] = function() {
    return this.matchMethod("delete", Tower.Support.Array.args(arguments));
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
      options.name = this._scope.name + Tower.Support.String.camelize(options.name);
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
    this._scope = Tower.Support.Object.extend({}, originalScope, options);
    block.call(this);
    this._scope = originalScope;
    return this;
  };

  DSL.prototype.controller = function(controller, options, block) {
    options.controller = controller;
    return this.scope(options, block);
  };

  DSL.prototype.namespace = function(path, options, block) {
    if (typeof options === 'function') {
      block = options;
      options = {};
    } else {
      options = {};
    }
    options = Tower.Support.Object.extend({
      name: path,
      path: path,
      as: path,
      module: path,
      shallowPath: path,
      shallowPrefix: path
    }, options);
    if (options.name && this._scope.name) {
      options.name = this._scope.name + Tower.Support.String.camelize(options.name);
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
    var path;
    if (options == null) options = {};
    options.controller = name;
    path = "/" + name;
    if (this._scope.path) path = this._scope.path + path;
    if (this._scope.name) {
      name = this._scope.name + Tower.Support.String.camelize(name);
    }
    this.match("" + path + "/new", Tower.Support.Object.extend({
      name: "new" + (Tower.Support.String.camelize(name)),
      action: "new"
    }, options));
    this.match("" + path, Tower.Support.Object.extend({
      action: "create",
      method: "POST"
    }, options));
    this.match("" + path, Tower.Support.Object.extend({
      name: name,
      action: "show"
    }, options));
    this.match("" + path + "/edit", Tower.Support.Object.extend({
      name: "edit" + (Tower.Support.String.camelize(name)),
      action: "edit"
    }, options));
    this.match("" + path, Tower.Support.Object.extend({
      action: "update",
      method: "PUT"
    }, options));
    return this.match("" + path, Tower.Support.Object.extend({
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
      many = this._scope.name + Tower.Support.String.camelize(name);
    } else {
      many = name;
    }
    one = Tower.Support.String.singularize(many);
    this.match("" + path, Tower.Support.Object.extend({
      name: "" + many,
      action: "index"
    }, options));
    this.match("" + path + "/new", Tower.Support.Object.extend({
      name: "new" + (Tower.Support.String.camelize(one)),
      action: "new"
    }, options));
    this.match("" + path, Tower.Support.Object.extend({
      action: "create",
      method: "POST"
    }, options));
    this.match("" + path + "/:id", Tower.Support.Object.extend({
      name: "" + one,
      action: "show"
    }, options));
    this.match("" + path + "/:id/edit", Tower.Support.Object.extend({
      name: "edit" + (Tower.Support.String.camelize(one)),
      action: "edit"
    }, options));
    this.match("" + path + "/:id", Tower.Support.Object.extend({
      action: "update",
      method: "PUT"
    }, options));
    this.match("" + path + "/:id", Tower.Support.Object.extend({
      action: "destroy",
      method: "DELETE"
    }, options));
    if (callback) {
      this.scope(Tower.Support.Object.extend({
        path: "" + path + "/:" + (Tower.Support.String.singularize(name)) + "Id",
        name: one
      }, options), callback);
    }
    return this;
  };

  DSL.prototype.collection = function() {};

  DSL.prototype.member = function() {};

  DSL.prototype.root = function(options) {
    return this.match('/', Tower.Support.Object.extend({
      as: "root"
    }, options));
  };

  DSL.prototype._extractOptions = function() {
    var anchor, args, constraints, controller, defaults, format, method, name, options, path;
    args = Tower.Support.Array.args(arguments);
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
    options = Tower.Support.Object.extend(options, {
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
    return Tower.Support.Object.extend(this._scope.constraints || {}, options.constraints || {});
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
      className: Tower.Support.String.camelize("" + controller)
    };
  };

  return DSL;

})();

module.exports = Tower.Route.DSL;
