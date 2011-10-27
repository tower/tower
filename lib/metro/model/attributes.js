(function() {
  var Attributes;
  Attributes = (function() {
    Attributes.key = function(key, options) {
      this.keys()[key] = options;
      Object.defineProperty(this.prototype, key, {
        enumerable: true,
        configurable: true,
        get: function() {
          return this.getAttribute(key);
        },
        set: function(value) {
          return this.setAttribute(key, value);
        }
      });
      return this;
    };
    Attributes.keys = function() {
      var _ref;
      return (_ref = this._keys) != null ? _ref : this._keys = {};
    };
    Attributes.prototype.getAttribute = function(name) {
      return this.attributes[name];
    };
    if (!Attributes.hasOwnProperty("get")) {
      Attributes.alias("get", "getField");
    }
    Attributes.prototype.setAttribute = function(name, value) {
      var beforeValue;
      beforeValue = this._trackChangedAttribute(name, value);
      return this.attributes[name] = value;
    };
    if (!Attributes.hasOwnProperty("set")) {
      Attributes.alias("set", "setField");
    }
    Attributes.prototype._trackChangedAttribute = function(attribute, value) {
      var array, beforeValue, _base, _ref, _ref2;
      array = (_ref = (_base = this.changes)[attribute]) != null ? _ref : _base[attribute] = [];
      beforeValue = (_ref2 = array[0]) != null ? _ref2 : array[0] = this.attributes[attribute];
      array[1] = value;
      if (array[0] === array[1]) {
        array = null;
      }
      if (array) {
        this.changes[attribute] = array;
      } else {
        delete this.changes[attribute];
      }
      return beforeValue;
    };
    function Attributes(attrs) {
      if (attrs == null) {
        attrs = {};
      }
      this.attributes = attrs;
      this.changes = {};
    }
    return Attributes;
  })();
  module.exports = Attributes;
}).call(this);
