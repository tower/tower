
Tower.Controller.Instrumentation = {
  call: function(request, response, next) {
    this.request = request;
    this.response = response;
    this.params = this.request.params || {};
    this.cookies = this.request.cookies || {};
    this.query = this.request.query || {};
    this.session = this.request.session || {};
    this.format = this.params.format;
    this.action = this.params.action;
    this.headers = {};
    this.callback = next;
    if (this.format && this.format !== "undefined" && Tower.Support["Path"]) {
      this.contentType = Tower.Support.Path.contentType(this.format);
    } else {
      this.contentType = "text/html";
    }
    return this.process();
  },
  process: function() {
    var _this = this;
    this.processQuery();
    return this.runCallbacks("action", function(callback) {
      return _this[_this.params.action].call(_this, callback);
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
