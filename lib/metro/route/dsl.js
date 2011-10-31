var __slice = Array.prototype.slice;
Metro.Route.DSL = (function() {
  function DSL() {}
  DSL.prototype.match = function() {
    var _ref;
    if ((_ref = this.scope) == null) {
      this.scope = {};
    }
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
    if (controller == null) {
      controller = options.controller || this.scope.controller;
    }
    if (action == null) {
      action = options.action || this.scope.action;
    }
    controller = controller.toLowerCase().replace(/(?:Controller)?$/, "Controller");
    action = action.toLowerCase();
    return {
      name: controller,
      action: action,
      className: _.camelize("_" + controller)
    };
  };
  return DSL;
})();
module.exports = Metro.Route.DSL;