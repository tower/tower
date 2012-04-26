
Tower.Controller.Instrumentation = {
  InstanceMethods: {
    call: function(request, response, next) {
      var _base;
      this.request = request;
      this.response = response;
      this.params = this.request.params || {};
      this.cookies = this.request.cookies || {};
      this.query = this.request.query || {};
      this.session = this.request.session || {};
      if (!this.params.format) {
        try {
          this.params.format = require('mime').extension(this.request.header('content-type'));
        } catch (_error) {}
        (_base = this.params).format || (_base.format = 'html');
      }
      this.format = this.params.format;
      this.action = this.params.action;
      this.headers = {};
      this.callback = next;
      return this.process();
    },
    process: function() {
      var _this = this;
      this.processQuery();
      if (!Tower.env.match(/(test|production)/)) {
        console.log("  Processing by " + (this.constructor.className()) + "#" + this.action + " as " + (this.format.toUpperCase()));
        console.log("  Parameters:");
        console.log(this.params);
      }
      return this.runCallbacks('action', {
        name: this.action
      }, function(callback) {
        return _this[_this.action].call(_this, callback);
      });
    },
    processQuery: function() {},
    clear: function() {
      this.request = null;
      return this.response = null;
    },
    metadata: function() {
      return this.constructor.metadata();
    }
  }
};

module.exports = Tower.Controller.Instrumentation;
