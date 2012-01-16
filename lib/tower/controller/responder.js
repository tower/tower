
Tower.Controller.Responder = (function() {

  function Responder(controller, resources, options) {
    if (options == null) options = {};
    this.controller = controller;
    this.request = controller.request;
    this.format = controller.formats[0];
    this.resource = resources[resources.length - 1];
    this.resources = resources;
    this.action = options.action;
    this.defaultResponse = options.defaultResponse;
    delete options.action;
    delete options.defaultResponse;
    this.options = options;
  }

  Responder.prototype.respond = function() {
    var method;
    method = "to" + (format.toUpperCase());
    method = this[method];
    if (method) {
      return method();
    } else {
      return this.toFormat();
    }
  };

  Responder.prototype.toHTML = function() {
    try {
      return this.defaultRender();
    } catch (error) {
      return this._navigationBehavior(error);
    }
  };

  Responder.prototype.toJSON = function() {
    return this.defaultRender();
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
      return raise(error);
    } else if ((typeof hasErrors !== "undefined" && hasErrors !== null) && defaultAction) {
      return this.render({
        action: this.defaultAction
      });
    } else {
      return this.redirectTo(this.navigationLocation);
    }
  };

  Responder.prototype._apiBehavior = function(error) {
    if (typeof resourceful === "undefined" || resourceful === null) raise(error);
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
    if (givenOptions == null) givenOptions = {};
    return this.controller.render(_.extend(givenOptions, options, {
      format: resource
    }));
  };

  Responder.prototype.displayErrors = function() {
    return controller.render({
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
    if (typeof this.respondTo === "function" ? this.respondTo("" + format + "ResourceErrors") : void 0) {
      return this["" + format + "RresourceErrors"];
    } else {
      return this.resource.errors;
    }
  };

  Responder.prototype.jsonResourceErrors = function() {
    return {
      errors: resource.errors
    };
  };

  return Responder;

})();

module.exports = Tower.Controller.Responder;
