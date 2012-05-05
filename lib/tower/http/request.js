var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.HTTP.Request = (function() {

  function Request(data) {
    if (data == null) {
      data = {};
    }
    this.url = data.url;
    this.location = data.location;
    this.pathname = this.location.path;
    this.query = this.location.query;
    this.title = data.title;
    this.title || (this.title = typeof document !== "undefined" && document !== null ? document.title : void 0);
    this.body = data.body || {};
    this.headers = data.headers || {};
    this.method = data.method || "GET";
  }

  __defineProperty(Request,  "header", function() {});

  return Request;

})();

module.exports = Tower.HTTP.Request;
