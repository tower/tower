
Tower.Store.Serializers = {
  String: {
    from: function(serialized) {
      if (_.none(serialized)) {
        return null;
      } else {
        return String(serialized);
      }
    },
    to: function(deserialized) {
      if (_.none(deserialized)) {
        return null;
      } else {
        return String(deserialized);
      }
    }
  },
  Number: {
    from: function(serialized) {
      if (_.none(serialized)) {
        return null;
      } else {
        return Number(serialized);
      }
    },
    to: function(deserialized) {
      if (_.none(deserialized)) {
        return null;
      } else {
        return Number(deserialized);
      }
    }
  },
  Integer: {
    from: function(serialized) {
      if (_.none(serialized)) {
        return null;
      } else {
        return parseInt(serialized);
      }
    },
    to: function(deserialized) {
      if (_.none(deserialized)) {
        return null;
      } else {
        return parseInt(deserialized);
      }
    }
  },
  Float: {
    from: function(serialized) {
      return parseFloat(serialized);
    },
    to: function(deserialized) {
      return deserialized;
    }
  },
  Boolean: {
    from: function(serialized) {
      if (typeof serialized === "string") {
        return !!(serialized !== "false");
      } else {
        return Boolean(serialized);
      }
    },
    to: function(deserialized) {
      return Tower.Model.Attribute.boolean.from(deserialized);
    }
  },
  Date: {
    from: function(date) {
      return date;
    },
    to: function(date) {
      return _.toDate(date);
    }
  },
  Geo: {
    from: function(serialized) {
      return serialized;
    },
    to: function(deserialized) {
      switch (_.kind(deserialized)) {
        case "array":
          return {
            lat: deserialized[0],
            lng: deserialized[1]
          };
        case "object":
          return {
            lat: deserialized.lat || deserialized.latitude,
            lng: deserialized.lng || deserialized.longitude
          };
        default:
          deserialized = deserialized.split(/,\ */);
          return {
            lat: parseFloat(deserialized[0]),
            lng: parseFloat(deserialized[1])
          };
      }
    }
  },
  Array: {
    from: function(serialized) {
      if (_.none(serialized)) {
        return null;
      } else {
        return _.castArray(serialized);
      }
    },
    to: function(deserialized) {
      return Tower.Model.Attribute.array.from(deserialized);
    }
  }
};

Tower.Store.Serializers.Decimal = Tower.Store.Serializers.Float;

Tower.Store.Serializers.Time = Tower.Store.Serializers.Date;

Tower.Store.Serializers.DateTime = Tower.Store.Serializers.Date;

module.exports = Tower.Store.Serializers;
