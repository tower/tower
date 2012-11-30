
Tower.NetAgent.prototype.request = function(method, path, options, callback) {
  var url;
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  options || (options = {});
  url = path;
  return History.pushState(null, null, url);
};
