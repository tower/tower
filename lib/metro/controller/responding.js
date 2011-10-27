(function() {
  var Responding;
  Responding = (function() {
    function Responding() {}
    Responding.include(Metro.Support.Concern);
    Responding.respond_to = function() {
      var _ref;
      if ((_ref = this._respond_to) == null) {
        this._respond_to = [];
      }
      return this._respond_to = this._respond_to.concat(arguments);
    };
    Responding.prototype.respond_with = function() {
      var callback, data;
      data = arguments[0];
      if (arguments.length > 1 && typeof arguments[arguments.length - 1] === "function") {
        callback = arguments[arguments.length - 1];
      }
      switch (this.format) {
        case "json":
          return this.render({
            json: data
          });
        case "xml":
          return this.render({
            xml: data
          });
        default:
          return this.render({
            action: this.action
          });
      }
    };
    Responding.prototype.call = function(request, response, next) {
      this.request = request;
      this.response = response;
      this.params = this.request.params || {};
      this.cookies = this.request.cookies || {};
      this.query = this.request.query || {};
      this.session = this.request.session || {};
      this.format = this.params.format;
      this.headers = {};
      if (this.format && this.format !== "undefined") {
        this.content_type = Metro.Support.Path.content_type(this.format);
      } else {
        this.content_type = "text/html";
      }
      return this.process();
    };
    Responding.prototype.process = function() {
      this.process_query();
      return this[this.params.action]();
    };
    Responding.prototype.process_query = function() {};
    return Responding;
  })();
  module.exports = Responding;
}).call(this);
