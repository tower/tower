(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Controller = (function() {

    __extends(Controller, Metro.Object);

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

  Metro.Controller.include(Metro.Controller.Callbacks);

  Metro.Controller.include(Metro.Controller.Helpers);

  Metro.Controller.include(Metro.Controller.HTTP);

  Metro.Controller.include(Metro.Controller.Layouts);

  Metro.Controller.include(Metro.Controller.Params);

  Metro.Controller.include(Metro.Controller.Processing);

  Metro.Controller.include(Metro.Controller.Redirecting);

  Metro.Controller.include(Metro.Controller.Rendering);

  Metro.Controller.include(Metro.Controller.Resources);

  Metro.Controller.include(Metro.Controller.Responding);

  Metro.Controller.include(Metro.Controller.Sockets);

  module.exports = Metro.Controller;

}).call(this);
