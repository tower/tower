
Tower.Controller.Instrumentation = {
  call: function(request, response, next) {
    this.request = request;
    this.response = response;
    this.params = this.request.params || {};
    this.cookies = this.request.cookies || {};
    this.query = this.request.query || {};
    this.session = this.request.session || {};
    this.format = this.params.format || "html";
    this.action = this.params.action;
    this.headers = {};
    this.callback = next;
    return this.process();
  },
  process: function() {
    var _this = this;
    this.processQuery();
    if (!Tower.env.match(/(test|production)/)) {
      console.log("  Processing by " + this.constructor.name + "#" + this.action + " as " + (this.format.toUpperCase()));
      console.log("  Parameters:");
      console.log(this.params);
    }
    return this.runCallbacks("action", {
      name: this.action
    }, function(callback) {
      return _this[_this.action].call(_this, callback);
    });
  },
  processQuery: function() {},
  clear: function() {
    this.request = null;
    this.response = null;
    return this.headers = null;
  }
};

module.exports = Tower.Controller.Instrumentation;
