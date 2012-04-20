
Tower.Controller.Responder = (function() {

  Responder.name = 'Responder';

  Responder.respond = function(controller, options, callback) {
    var responder;
    responder = new this(controller, options);
    return responder.respond(callback);
  };

  function Responder(controller, options) {
    var format, _i, _len, _ref;
    if (options == null) {
      options = {};
    }
    this.controller = controller;
    this.options = options;
    _ref = this.controller.formats;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      format = _ref[_i];
      this.accept(format);
    }
  }

  Responder.prototype.accept = function(format) {
    return this[format] = function(callback) {
      return this["_" + format] = callback;
    };
  };

  Responder.prototype.respond = function(callback) {
    var method;
    if (callback) {
      callback.call(this.controller, this);
    }
    method = this["_" + this.controller.format];
    if (method) {
      return method.call(this);
    } else {
      return this.toFormat();
    }
  };

  Responder.prototype._html = function() {
    return this.controller.render({
      action: this.controller.action
    });
  };

  Responder.prototype._json = function() {
    return this.controller.render({
      json: this.options.records
    });
  };

  Responder.prototype.toFormat = function() {
    try {
      if ((typeof get !== "undefined" && get !== null) || !(typeof hasErrors !== "undefined" && hasErrors !== null)) {
        return this.defaultRender();
      } else {
        return this.displayErrors();
      }
    } catch (error) {
      return this._apiBehavior(error);
    }
  };

  Responder.prototype._navigationBehavior = function(error) {
    if (typeof get !== "undefined" && get !== null) {
      throw error;
    } else if ((typeof hasErrors !== "undefined" && hasErrors !== null) && defaultAction) {
      return this.render({
        action: this.defaultAction
      });
    } else {
      return this.redirectTo(this.navigationLocation);
    }
  };

  Responder.prototype._apiBehavior = function(error) {
    if (typeof get !== "undefined" && get !== null) {
      return this.display(resource);
    } else if (typeof post !== "undefined" && post !== null) {
      return this.display(resource, {
        status: "created",
        location: this.apiLocation
      });
    } else {
      return this.head("noContent");
    }
  };

  Responder.prototype.isResourceful = function() {
    return this.resource.hasOwnProperty("to" + (this.format.toUpperCase()));
  };

  Responder.prototype.resourceLocation = function() {
    return this.options.location || this.resources;
  };

  Responder.prototype.defaultRender = function() {
    return this.defaultResponse.call(options);
  };

  Responder.prototype.display = function(resource, givenOptions) {
    if (givenOptions == null) {
      givenOptions = {};
    }
    return this.controller.render(_.extend(givenOptions, this.options, {
      format: this.resource
    }));
  };

  Responder.prototype.displayErrors = function() {
    return this.controller.render({
      format: this.resourceErrors,
      status: "unprocessableEntity"
    });
  };

  Responder.prototype.hasErrors = function() {
    var _base;
    return (typeof (_base = this.resource).respondTo === "function" ? _base.respondTo("errors") : void 0) && !(this.resource.errors.empty != null);
  };

  Responder.prototype.defaultAction = function() {
    return this.action || (this.action = ACTIONS_FOR_VERBS[request.requestMethodSymbol]);
  };

  Responder.prototype.resourceErrors = function() {
    if (this.hasOwnProperty("" + format + "ResourceErrors")) {
      return this["" + format + "RresourceErrors"];
    } else {
      return this.resource.errors;
    }
  };

  Responder.prototype.jsonResourceErrors = function() {
    return {
      errors: this.resource.errors
    };
  };

  return Responder;

})();

module.exports = Tower.Controller.Responder;
