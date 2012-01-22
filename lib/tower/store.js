var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Store = (function() {

  __extends(Store, Tower.Class);

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
    if (attributes instanceof Tower.Model) return attributes;
    klass = Tower.constant(this.className);
    return new klass(attributes);
  };

  Store.prototype.deserializeModel = function(model) {
    return model.attributes;
  };

  function Store(options) {
    if (options == null) options = {};
    this.name = options.name;
    this.className = options.type || Tower.namespaced(Tower.Support.String.camelize(Tower.Support.String.singularize(this.name)));
  }

  Store.prototype.find = function(query, options, callback) {};

  Store.prototype.findOne = function() {};

  Store.prototype.create = function(attributes, options, callback) {
    if (options.instantiate) {
      return this._createEach(attributes, options, callback);
    } else {
      return this._create(attributes, options, callback);
    }
  };

  Store.prototype._createEach = function(attributes, options, callback) {
    var isArray;
    var _this = this;
    isArray = Tower.Support.Object.isArray(attributes);
    return this._build(attributes, options, function(error, records) {
      var iterator;
      if (error) return callback(error);
      records = Tower.Support.Object.toArray(records);
      iterator = function(record, next) {
        return record.save(next);
      };
      return Tower.async(records, iterator, function(error) {
        if (!callback) {
          if (error) throw error;
        } else {
          if (error) return callback(error);
          if (isArray) {
            return callback(error, records);
          } else {
            return callback(error, records[0]);
          }
        }
      });
    });
  };

  Store.prototype.update = function(updates, query, options, callback) {
    if (options.instantiate) {
      return this._updateEach(updates, query, options, callback);
    } else {
      return this._update(updates, query, options, callback);
    }
  };

  Store.prototype._updateEach = function(updates, query, options, callback) {
    var iterator;
    iterator = function(record, next) {
      return record.updateAttributes(updates, next);
    };
    return this.each(query, options, iterator, callback);
  };

  Store.prototype._update = function(updates, query, options, callback) {};

  Store.prototype.destroy = function(query, options, callback) {
    if (options.instantiate) {
      return this._destroyEach(query, options, callback);
    } else {
      return this._destroy(query, options, callback);
    }
  };

  Store.prototype._destroyEach = function(query, options, callback) {
    var iterator;
    iterator = function(record, next) {
      return record.destroy(next);
    };
    return this.each(query, options, iterator, callback);
  };

  Store.prototype._destroy = function(query, options, callback) {};

  Store.prototype["delete"] = function(query, options, callback) {
    return this.destroy.apply(this, arguments);
  };

  Store.prototype.build = function(attributes, options, callback) {
    var record;
    record = this.serializeModel(attributes);
    if (callback) callback.call(this, null, record);
    return record;
  };

  Store.prototype.load = function(records) {};

  Store.prototype.each = function(query, options, iterator, callback) {
    var _this = this;
    return this.find(query, options, function(error, records) {
      if (error) {
        return callback.call(_this, error, records);
      } else {
        return Tower.async(records, iterator, function(error) {
          if (!callback) {
            if (error) throw error;
          } else {
            if (callback) return callback.call(_this, error, records);
          }
        });
      }
    });
  };

  Store.prototype.schema = function() {
    return Tower.constant(this.className).fields();
  };

  return Store;

})();

require('./store/cassandra');

require('./store/couchdb');

require('./store/fileSystem');

require('./store/local');

require('./store/memory');

require('./store/mongodb');

require('./store/neo4j');

require('./store/postgresql');

require('./store/riak');

require('./store/redis');

module.exports = Tower.Store;
