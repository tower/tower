var _,
  __slice = [].slice;

_ = Tower._;

Tower.StoreMemoryFinders = {
  find: function(cursor, callback) {
    var conditions, endIndex, limit, record, records, result, sort, startIndex, usingGeo, _i, _j, _len, _len1;
    result = [];
    records = this.records.toArray();
    conditions = cursor.conditions();
    usingGeo = this._conditionsUseGeo(conditions);
    if (usingGeo) {
      this._calculateDistances(records, this._getCoordinatesFromConditions(conditions));
      this._prepareConditionsForTesting(conditions);
    }
    if (_.isPresent(conditions)) {
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        if (Tower.StoreOperators.test(record, conditions)) {
          result.push(record);
        }
      }
    } else {
      for (_j = 0, _len1 = records.length; _j < _len1; _j++) {
        record = records[_j];
        result.push(record);
      }
    }
    sort = usingGeo ? this._getGeoSortCriteria() : cursor.getCriteria('order');
    limit = cursor.getCriteria('limit');
    startIndex = cursor.getCriteria('offset') || 0;
    if (sort.length) {
      result = this.sort(result, sort);
    }
    endIndex = startIndex + (limit || result.length) - 1;
    result = result.slice(startIndex, endIndex + 1 || 9e9);
    if (callback) {
      result = callback.call(this, null, result);
    }
    return result;
  },
  findOne: function(cursor, callback) {
    var record,
      _this = this;
    record = void 0;
    cursor.limit(1);
    this.find(cursor, function(error, records) {
      record = records[0] || null;
      if (callback) {
        return callback.call(_this, error, record);
      }
    });
    return record;
  },
  count: function(cursor, callback) {
    var result,
      _this = this;
    result = void 0;
    this.find(cursor, function(error, records) {
      result = records.length;
      if (callback) {
        return callback.call(_this, error, result);
      }
    });
    return result;
  },
  exists: function(cursor, callback) {
    var result,
      _this = this;
    result = void 0;
    this.count(cursor, function(error, record) {
      result = !!record;
      if (callback) {
        return callback.call(_this, error, result);
      }
    });
    return result;
  },
  sort: function(records, sortings) {
    return _.sortBy.apply(_, [records].concat(__slice.call(sortings)));
  },
  _getCoordinatesFromConditions: function(conditions) {
    if (_.isObject(conditions) && (conditions.coordinates != null)) {
      return conditions.coordinates['$near'];
    }
  },
  _getGeoSortCriteria: function() {
    return [['__distance', 'asc']];
  },
  _calculateDistances: function(records, nearCoordinate) {
    var center, coordinates, record, _i, _len, _results;
    center = {
      latitude: nearCoordinate.lat,
      longitude: nearCoordinate.lng
    };
    _results = [];
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      coordinates = record.get('coordinates');
      coordinates = {
        latitude: coordinates.lat,
        longitude: coordinates.lng
      };
      _results.push(record.__distance = Tower.module('geo').getDistance(center, coordinates));
    }
    return _results;
  },
  _prepareConditionsForTesting: function(conditions) {
    if (!(_.isHash(conditions) && _.isHash(conditions.coordinates))) {
      return;
    }
    return delete conditions.coordinates['$near'];
  },
  _conditionsUseGeo: function(conditions) {
    var key, value;
    if (!_.isHash(conditions)) {
      return false;
    }
    for (key in conditions) {
      value = conditions[key];
      if (_.isHash(value) && (_.isPresent(value['$near']) || _.isPresent(value['$maxDistance']))) {
        return true;
      }
    }
  }
};

if (Tower.isClient) {
  Tower.StoreMemoryFinders.fetch = function(cursor, callback) {
    var method,
      _this = this;
    method = cursor._limit === 1 ? 'findOne' : 'find';
    if (Tower.NetConnection.transport) {
      return Tower.NetConnection.transport[method](cursor, function(error, records) {
        if (callback) {
          callback(error, records);
        } else if (Tower.debug) {
          console.log(records);
        }
        return records;
      });
    } else {
      return this[method](cursor, callback);
    }
  };
}

module.exports = Tower.StoreMemoryFinders;
