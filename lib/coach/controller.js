(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Coach.Controller = (function() {

    __extends(Controller, Coach.Class);

    Controller.extend(Coach.Support.EventEmitter);

    Controller.include(Coach.Support.EventEmitter);

    function Controller() {
      this.constructor.instance = this;
      this.headers = {};
      this.status = 200;
      this.request = null;
      this.response = null;
      this.contentType = "text/html";
      this.params = {};
      this.query = {};
      this.resourceName = this.constructor.resourceName;
      this.resourceType = this.constructor.resourceType;
      this.collectionName = this.constructor.collectionName;
      if (this.constructor._belongsTo) {
        this.hasParent = true;
      } else {
        this.hasParent = false;
      }
    }

    return Controller;

  })();

  require('./controller/callbacks');

  require('./controller/helpers');

  require('./controller/http');

  require('./controller/layouts');

  require('./controller/params');

  require('./controller/processing');

  require('./controller/redirecting');

  require('./controller/rendering');

  require('./controller/resources');

  require('./controller/responding');

  require('./controller/sockets');

  Coach.Controller.include(Coach.Controller.Callbacks);

  Coach.Controller.include(Coach.Controller.Helpers);

  Coach.Controller.include(Coach.Controller.HTTP);

  Coach.Controller.include(Coach.Controller.Layouts);

  Coach.Controller.include(Coach.Controller.Params);

  Coach.Controller.include(Coach.Controller.Processing);

  Coach.Controller.include(Coach.Controller.Redirecting);

  Coach.Controller.include(Coach.Controller.Rendering);

  Coach.Controller.include(Coach.Controller.Resources);

  Coach.Controller.include(Coach.Controller.Responding);

  Coach.Controller.include(Coach.Controller.Sockets);

  module.exports = Coach.Controller;

}).call(this);
