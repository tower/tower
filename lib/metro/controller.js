(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Controller = (function() {

    __extends(Controller, Metro.Object);

    function Controller() {
      this.headers = {};
      this.status = 200;
      this.request = null;
      this.response = null;
      this.contentType = "text/html";
      this.params = {};
      this.query = {};
    }

    return Controller;

  })();

  require('./controller/caching');

  require('./controller/helpers');

  require('./controller/http');

  require('./controller/layouts');

  require('./controller/params');

  require('./controller/processing');

  require('./controller/redirecting');

  require('./controller/rendering');

  require('./controller/resources');

  require('./controller/responding');

  Metro.Controller.include(Metro.Controller.Caching);

  Metro.Controller.include(Metro.Controller.Helpers);

  Metro.Controller.include(Metro.Controller.HTTP);

  Metro.Controller.include(Metro.Controller.Layouts);

  Metro.Controller.include(Metro.Controller.Params);

  Metro.Controller.include(Metro.Controller.Processing);

  Metro.Controller.include(Metro.Controller.Redirecting);

  Metro.Controller.include(Metro.Controller.Rendering);

  Metro.Controller.include(Metro.Controller.Resources);

  Metro.Controller.include(Metro.Controller.Responding);

  module.exports = Metro.Controller;

}).call(this);
