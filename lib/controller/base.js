(function() {
  var Base;
  Base = (function() {
    function Base() {
      this._headers = {
        "Content-Type": "text/html"
      };
      this._status = 200;
      this._request = null;
      this._response = null;
      this._routes = null;
    }
    Base.prototype.params = function() {
      var _ref;
      return (_ref = this._params) != null ? _ref : this._params = this.request.parameters();
    };
    Base.controller_name = function() {
      return _.underscore(this.name);
    };
    Base.prototype.controller_name = function() {
      return this.constructor.controller_name();
    };
    return Base;
  })();
}).call(this);
