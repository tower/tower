
Tower.HTTP.Agent.prototype.request = function(method, path, options, callback) {
  var headers, params;
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  options || (options = {});
  headers = options.headers || {};
  params = options.params || {};
  return History.pushState;
};
