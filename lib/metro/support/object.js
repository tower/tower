
  Metro.Support.Object = {
    isA: function(object, isa) {},
    isHash: function() {
      var object;
      object = arguments[0] || this;
      return _.isObject(object) && !(_.isFunction(object) || _.isArray(object));
    },
    isPresent: function(object) {
      var key, value;
      for (key in object) {
        value = object[key];
        return true;
      }
      return false;
    },
    isBlank: function(object) {
      var key, value;
      for (key in object) {
        value = object[key];
        return false;
      }
      return true;
    }
  };

  module.exports = Metro.Support.Object;
