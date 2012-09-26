var __defineStaticProperty = function(clazz, key, value) {
  if (typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
};

Tower.NetCookies = (function() {

  __defineStaticProperty(NetCookies,  "parse", function(string) {
    var eqlIndex, key, pair, pairs, result, value, _i, _len;
    if (string == null) {
      string = document.cookie;
    }
    result = {};
    pairs = string.split(/[;,] */);
    for (_i = 0, _len = pairs.length; _i < _len; _i++) {
      pair = pairs[_i];
      eqlIndex = pair.indexOf('=');
      key = pair.substring(0, eqlIndex).trim().toLowerCase();
      value = pair.substring(++eqlIndex, pair.length).trim();
      if ('"' === value[0]) {
        value = value.slice(1, -1);
      }
      if (result[key] === void 0) {
        value = value.replace(/\+/g, ' ');
        try {
          result[key] = decodeURIComponent(value);
        } catch (error) {
          if (error instanceof URIError) {
            result[key] = value;
          } else {
            throw err;
          }
        }
      }
    }
    return new this(result);
  });

  function NetCookies(attributes) {
    if (attributes == null) {
      attributes = {};
    }
    _.extend(this, attributes);
  }

  return NetCookies;

})();

module.exports = Tower.NetCookies;
