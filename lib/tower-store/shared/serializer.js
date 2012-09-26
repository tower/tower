var _;

_ = Tower._;

Tower.StoreSerializerString = {
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
};

Tower.StoreSerializerNumber = {
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
};

Tower.StoreSerializerInteger = {
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
};

Tower.StoreSerializerFloat = {
  from: function(serialized) {
    return parseFloat(serialized);
  },
  to: function(deserialized) {
    return deserialized;
  }
};

Tower.StoreSerializerBoolean = {
  from: function(serialized) {
    if (typeof serialized === 'string') {
      return !!(serialized !== 'false');
    } else {
      return Boolean(serialized);
    }
  },
  to: function(deserialized) {
    return Tower.StoreSerializerBoolean.from(deserialized);
  }
};

Tower.StoreSerializerDate = {
  from: function(date) {
    return date;
  },
  to: function(date) {
    return _.toDate(date);
  }
};

Tower.StoreSerializerGeo = {
  from: function(serialized) {
    return serialized;
  },
  to: function(deserialized) {
    switch (_.kind(deserialized)) {
      case 'array':
        return {
          lat: deserialized[0],
          lng: deserialized[1]
        };
      case 'object':
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
};

Tower.StoreSerializerArray = {
  from: function(serialized) {
    if (_.none(serialized)) {
      return null;
    } else {
      return _.castArray(serialized);
    }
  },
  to: function(deserialized) {
    return Tower.StoreSerializerArray.from(deserialized);
  }
};

Tower.StoreSerializerDecimal = Tower.StoreSerializerFloat;

Tower.StoreSerializerTime = Tower.StoreSerializerDate;

Tower.StoreSerializerDateTime = Tower.StoreSerializerDate;

module.exports = Tower.StoreSerializer;
