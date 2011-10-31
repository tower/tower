var Client;
Client = (function() {
  function Client() {}
  Client.prototype.request = function(method, url, options) {
    if (options == null) {
      options = {};
    }
  };
  return Client;
})();