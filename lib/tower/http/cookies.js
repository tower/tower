
Tower.HTTP.Cookies = (function() {

  Cookies.name = 'Cookies';

  Cookies.parse = function(string) {
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
  };

  function Cookies(attributes) {
    var key, value;
    if (attributes == null) {
      attributes = {};
    }
    for (key in attributes) {
      value = attributes[key];
      this[key] = value;
    }
  }

  return Cookies;

})();

module.exports = Tower.HTTP.Cookies;
