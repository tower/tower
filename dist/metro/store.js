(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __slice = Array.prototype.slice;

  Metro.Store = (function() {

    __extends(Store, Metro.Object);

    Store.defaultLimit = 100;

    Store.atomicModifiers = {
      "$set": "$set",
      "$unset": "$unset",
      "$push": "$push",
      "$pushAll": "$pushAll",
      "$pull": "$pull",
      "$pullAll": "$pullAll"
    };

    Store.reservedOperators = {
      "_sort": "_sort",
      "_limit": "_limit"
    };

    Store.queryOperators = {
      ">=": "$gte",
      "$gte": "$gte",
      ">": "$gt",
      "$gt": "$gt",
      "<=": "$lte",
      "$lte": "$lte",
      "<": "$lt",
      "$lt": "$lt",
      "$in": "$in",
      "$nin": "$nin",
      "$any": "$any",
      "$all": "$all",
      "=~": "$regex",
      "$m": "$regex",
      "$regex": "$regex",
      "!~": "$nm",
      "$nm": "$nm",
      "=": "$eq",
      "$eq": "$eq",
      "!=": "$neq",
      "$neq": "$neq",
      "$null": "$null",
      "$notNull": "$notNull"
    };

    Store.booleans = {
      "true": true,
      "true": true,
      "TRUE": true,
      "1": true,
      1: true,
      1.0: true,
      "false": false,
      "false": false,
      "FALSE": false,
      "0": false,
      0: false,
      0.0: false
    };

    Store.prototype.serialize = function(data) {
      var i, item, _len;
      for (i = 0, _len = data.length; i < _len; i++) {
        item = data[i];
        data[i] = this.serializeModel(item);
      }
      return data;
    };

    Store.prototype.deserialize = function(models) {
      var i, model, _len;
      for (i = 0, _len = models.length; i < _len; i++) {
        model = models[i];
        models[i] = this.deserializeModel(model);
      }
      return models;
    };

    Store.prototype.serializeModel = function(attributes) {
      var klass;
      klass = Metro.constant(this.className);
      return new klass(attributes);
    };

    Store.prototype.deserializeModel = function(model) {
      return model.attributes;
    };

    function Store(options) {
      if (options == null) options = {};
      this.name = options.name;
      this.className = options.className || Metro.namespaced(Metro.Support.String.camelize(Metro.Support.String.singularize(this.name)));
    }

    Store.prototype.find = function() {
      var callback, ids, options, query, _i;
      ids = 4 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 3) : (_i = 0, []), query = arguments[_i++], options = arguments[_i++], callback = arguments[_i++];
      if (ids.length === 1) {
        query.id = ids[0];
        return this.findOne(query, options, callback);
      } else {
        query.id = {
          $in: ids
        };
        return this.all(query, options, callback);
      }
    };

    Store.prototype.first = function(query, options, callback) {
      return this.findOne(query, options, callback);
    };

    Store.prototype.last = function(query, options, callback) {
      return this.findOne(query, options, callback);
    };

    Store.prototype.build = function(attributes, options, callback) {
      var record;
      record = this.serializeModel(attributes);
      if (callback) callback.call(this, null, record);
      return record;
    };

    Store.prototype.update = function() {
      var callback, ids, options, query, updates, _i;
      ids = 5 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 4) : (_i = 0, []), updates = arguments[_i++], query = arguments[_i++], options = arguments[_i++], callback = arguments[_i++];
      query.id = {
        $in: ids
      };
      return this.updateAll(updates, query, options, callback);
    };

    Store.prototype["delete"] = function() {
      var callback, ids, options, query, _i;
      ids = 4 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 3) : (_i = 0, []), query = arguments[_i++], options = arguments[_i++], callback = arguments[_i++];
      query.id = ids.length === 1 ? ids[0] : {
        $in: ids
      };
      return this.deleteAll(query, options, callback);
    };

    Store.prototype.schema = function() {
      return Metro.constant(this.className).schema();
    };

    return Store;

  })();

  Metro.Store.Memory = (function() {

    __extends(Memory, Metro.Store);

    function Memory(options) {
      Memory.__super__.constructor.call(this, options);
      this.records = {};
      this.lastId = 0;
    }

    return Memory;

  })();

  Metro.Store.Memory.Finders = {
    all: function(query, options, callback) {
      var key, limit, record, records, result, self, sort;
      result = [];
      records = this.records;
      self = this;
      if (Metro.Support.Object.isPresent(query)) {
        sort = options.sort;
        limit = options.limit || Metro.Store.defaultLimit;
        for (key in records) {
          record = records[key];
          if (this.matches(record, query)) result.push(record);
        }
        if (sort) result = this.sort(result, sort);
        if (limit) result = result.slice(0, (limit - 1) + 1 || 9e9);
      } else {
        for (key in records) {
          record = records[key];
          result.push(record);
        }
      }
      if (callback) callback.call(self, null, result);
      return result;
    },
    first: function(query, options, callback) {
      var record;
      record = null;
      this.all(query, options, function(error, records) {
        record = records[0];
        if (callback) return callback.call(this, error, record);
      });
      return record;
    },
    last: function(query, options, callback) {
      var record;
      record = null;
      this.all(query, options, function(error, records) {
        record = records[records.length - 1];
        if (callback) return callback.call(this, error, record);
      });
      return record;
    },
    count: function(query, options, callback) {
      var result;
      result = 0;
      this.all(query, options, function(error, records) {
        result = records.length;
        if (callback) return callback.call(this, error, result);
      });
      return result;
    },
    sort: function() {
      var _ref;
      return (_ref = Metro.Support.Array).sortBy.apply(_ref, arguments);
    }
  };

  Metro.Store.Memory.Persistence = {
    create: function(attributes, options, callback) {
      var record, _ref;
      if ((_ref = attributes.id) == null) attributes.id = this.generateId();
      record = this.serializeModel(attributes);
      this.records[attributes.id] = record;
      if (callback) callback.call(this, null, record);
      return record;
    },
    updateAll: function(updates, query, options, callback) {
      var self;
      self = this;
      return this.all(query, options, function(error, records) {
        var i, key, record, value, _len;
        if (!error) {
          for (i = 0, _len = records.length; i < _len; i++) {
            record = records[i];
            for (key in updates) {
              value = updates[key];
              self._updateAttribute(record.attributes, key, value);
            }
          }
        }
        if (callback) return callback.call(this, error, records);
      });
    },
    deleteAll: function(query, options, callback) {
      var _records;
      _records = this.records;
      if (Metro.Support.Object.isBlank(query)) {
        return this.clear(callback);
      } else {
        return this.all(query, function(error, records) {
          var record, _i, _len;
          if (!error) {
            for (_i = 0, _len = records.length; _i < _len; _i++) {
              record = records[_i];
              _records.splice(_records.indexOf(record), 1);
            }
          }
          if (callback) return callback.call(this, error, records);
        });
      }
    },
    clear: function(callback) {
      this.records = {};
      if (callback) callback.call(this, error, records);
      return this.records;
    }
  };

  Metro.Store.Memory.Serialization = {
    matches: function(record, query) {
      var key, recordValue, schema, self, success, value;
      self = this;
      success = true;
      schema = this.schema();
      for (key in query) {
        value = query[key];
        if (!!Metro.Store.reservedOperators[key]) continue;
        recordValue = record[key];
        if (Metro.Support.Object.isRegExp(value)) {
          success = recordValue.match(value);
        } else if (typeof value === "object") {
          success = self._matchesOperators(record, recordValue, value);
        } else {
          if (typeof value === "function") value = value.call(record);
          success = recordValue === value;
        }
        if (!success) return false;
      }
      return true;
    },
    generateId: function() {
      return this.lastId++;
    },
    _updateAttribute: function(attributes, key, value) {
      var field;
      field = this.schema()[key];
      if (field && field.type === "Array" && !Metro.Support.Object.isArray(value)) {
        attributes[key] || (attributes[key] = []);
        return attributes[key].push(value);
      } else if (this._atomicModifier(key)) {
        return this["_" + (key.replace("$", "")) + "AtomicUpdate"](attributes, value);
      } else {
        return attributes[key] = value;
      }
    },
    _atomicModifier: function(key) {
      return !!this.constructor.atomicModifiers[key];
    },
    _pushAtomicUpdate: function(attributes, value) {
      var _key, _value;
      for (_key in value) {
        _value = value[_key];
        attributes[_key] || (attributes[_key] = []);
        attributes[_key].push(_value);
      }
      return attributes;
    },
    _pullAtomicUpdate: function(attributes, value) {
      var item, _attributeValue, _i, _key, _len, _value;
      for (_key in value) {
        _value = value[_key];
        _attributeValue = attributes[_key];
        if (_attributeValue) {
          for (_i = 0, _len = _value.length; _i < _len; _i++) {
            item = _value[_i];
            _attributeValue.splice(_attributeValue.indexOf(item), 1);
          }
        }
      }
      return attributes;
    },
    _matchesOperators: function(record, recordValue, operators) {
      var key, operator, self, success, value;
      success = true;
      self = this;
      for (key in operators) {
        value = operators[key];
        if (operator = Metro.Store.queryOperators[key]) {
          if (typeof value === "function") value = value.call(record);
          switch (operator) {
            case "$gt":
              success = self._isGreaterThan(recordValue, value);
              break;
            case "$gte":
              success = self._isGreaterThanOrEqualTo(recordValue, value);
              break;
            case "$lt":
              success = self._isLessThan(recordValue, value);
              break;
            case "$lte":
              success = self._isLessThanOrEqualTo(recordValue, value);
              break;
            case "$eq":
              success = self._isEqualTo(recordValue, value);
              break;
            case "$neq":
              success = self._isNotEqualTo(recordValue, value);
              break;
            case "$regex":
              success = self._isMatchOf(recordValue, value);
              break;
            case "$nm":
              success = self._isNotMatchOf(recordValue, value);
              break;
            case "$any":
              success = self._anyIn(recordValue, value);
              break;
            case "$all":
              success = self._allIn(recordValue, value);
          }
          if (!success) return false;
        } else {
          return recordValue === operators;
        }
      }
      return true;
    },
    _isGreaterThan: function(recordValue, value) {
      return recordValue && recordValue > value;
    },
    _isGreaterThanOrEqualTo: function(recordValue, value) {
      return recordValue && recordValue >= value;
    },
    _isLessThan: function(recordValue, value) {
      return recordValue && recordValue < value;
    },
    _isLessThanOrEqualTo: function(recordValue, value) {
      return recordValue && recordValue <= value;
    },
    _isEqualTo: function(recordValue, value) {
      return recordValue === value;
    },
    _isNotEqualTo: function(recordValue, value) {
      return recordValue !== value;
    },
    _isMatchOf: function(recordValue, value) {
      return !!(typeof recordValue === "string" ? recordValue.match(value) : recordValue.exec(value));
    },
    _isNotMatchOf: function(recordValue, value) {
      return !!!(typeof recordValue === "string" ? recordValue.match(value) : recordValue.exec(value));
    },
    _anyIn: function(recordValue, array) {
      var value, _i, _len;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        if (recordValue.indexOf(value) > -1) return true;
      }
      return false;
    },
    _allIn: function(recordValue, value) {
      var _i, _len;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        if (recordValue.indexOf(value) === -1) return false;
      }
      return true;
    }
  };

  Metro.Store.Memory.include(Metro.Store.Memory.Finders);

  Metro.Store.Memory.include(Metro.Store.Memory.Persistence);

  Metro.Store.Memory.include(Metro.Store.Memory.Serialization);

}).call(this);
