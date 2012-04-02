var __slice = Array.prototype.slice;

Tower.Model.Criteria = (function() {

  function Criteria(options) {
    if (options == null) options = {};
    this.model = options.model;
    this.store = this.model.store();
    this.instantiate = options.instantiate !== false;
    this._where = options.where || [];
    this._joins = options.joins || {};
    this._order = this._array(options.order);
    this._data = this._array(options.data);
    this._except = this._array(options.except, true);
    this._includes = this._array(options.except, true);
    this._offset = options.offset;
    this._limit = options.limit;
    this._fields = options.fields;
    this._uniq = options.uniq;
    this._eagerLoad = options.eagerLoad || {};
  }

  Criteria.prototype["export"] = function(result) {
    if (!this.returnArray) result = result[0];
    delete this.data;
    delete this.returnArray;
    return result;
  };

  Criteria.prototype.get = function(key) {
    return this["_" + key] || this[key];
  };

  Criteria.prototype.addData = function(args) {
    if (args.length && args.length > 1 || _.isArray(args[0])) {
      this.data = _.flatten(args);
      return this.returnArray = true;
    } else {
      this.data = _.flatten([args]);
      return this.returnArray = false;
    }
  };

  Criteria.prototype.eagerLoad = function(object) {
    return this._eagerLoad = _.extend(this._eagerLoad, object);
  };

  Criteria.prototype.joins = function(object) {
    var joins, key, _i, _len;
    joins = this._joins;
    if (_.isArray(object)) {
      for (_i = 0, _len = object.length; _i < _len; _i++) {
        key = object[_i];
        joins[key] = true;
      }
    } else if (typeof object === "string") {
      joins[object] = true;
    } else {
      _.extend(joins, object);
    }
    return joins;
  };

  Criteria.prototype.except = function() {
    return this._except = _.flatten(_.args(arguments));
  };

  Criteria.prototype.where = function(conditions) {
    if (conditions instanceof Tower.Model.Criteria) {
      return this.merge(conditions);
    } else {
      return this._where.push(conditions);
    }
  };

  Criteria.prototype.order = function(attribute, direction) {
    if (direction == null) direction = "asc";
    return this._order.push([attribute, direction]);
  };

  Criteria.prototype.sort = Criteria.prototype.order;

  Criteria.prototype.defaultSort = function(direction) {
    return this;
  };

  Criteria.prototype.asc = function() {
    var attribute, attributes, _i, _len;
    attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (_i = 0, _len = attributes.length; _i < _len; _i++) {
      attribute = attributes[_i];
      this.order(attribute);
    }
    return this._order;
  };

  Criteria.prototype.desc = function() {
    var attribute, attributes, _i, _len;
    attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (_i = 0, _len = attributes.length; _i < _len; _i++) {
      attribute = attributes[_i];
      this.order(attribute, "desc");
    }
    return this._order;
  };

  Criteria.prototype.allIn = function(attributes) {
    return this._whereOperator("$all", attributes);
  };

  Criteria.prototype.anyIn = function(attributes) {
    return this._whereOperator("$any", attributes);
  };

  Criteria.prototype.notIn = function(attributes) {
    return this._whereOperator("$nin", attributes);
  };

  Criteria.prototype.offset = function(number) {
    return this._offset = number;
  };

  Criteria.prototype.limit = function(number) {
    return this._limit = number;
  };

  Criteria.prototype.select = function() {
    return this._fields = _.flatten(_.args(fields));
  };

  Criteria.prototype.includes = function() {
    return this._includes = _.flatten(_.args(arguments));
  };

  Criteria.prototype.uniq = function(value) {
    return this._uniq = value;
  };

  Criteria.prototype.page = function(page) {
    return this.offset((page - 1) * this._limit || 20);
  };

  Criteria.prototype.paginate = function(options) {
    var limit, page;
    limit = options.perPage || options.limit;
    page = options.page || 1;
    this.limit(limit);
    return this.offset((page - 1) * limit);
  };

  Criteria.prototype.build = function(callback) {
    var attributes, data, item, object, result, store, _i, _len;
    store = this.store;
    attributes = this.attributes();
    data = this.data;
    if (!data.length) data.push({});
    result = [];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      item = data[_i];
      if (item instanceof Tower.Model) {
        _.extend(item.attributes, attributes, item.attributes);
      } else {
        object = store.serializeModel(_.extend({}, attributes, item));
      }
      result.push(object);
    }
    result = this.returnArray ? result : result[0];
    if (callback) callback.call(this, null, result);
    return result;
  };

  Criteria.prototype.create = function(callback) {
    return this._create(callback);
  };

  Criteria.prototype._create = function(callback) {
    var iterator, records, returnArray,
      _this = this;
    records = void 0;
    if (this.instantiate) {
      returnArray = this.returnArray;
      this.returnArray = true;
      records = this.build();
      this.returnArray = returnArray;
      iterator = function(record, next) {
        if (record) {
          return record.save(next);
        } else {
          return next();
        }
      };
      Tower.async(records, iterator, function(error) {
        if (!callback) {
          if (error) throw error;
          if (!returnArray) return records = records[0];
        } else {
          if (error) return callback(error);
          if (!returnArray) records = records[0];
          return callback(error, records);
        }
      });
    } else {
      this.store.create(this, callback);
    }
    return records;
  };

  Criteria.prototype.update = function(callback) {
    var iterator, updates,
      _this = this;
    updates = this.data[0];
    if (this.instantiate) {
      iterator = function(record, next) {
        return record.updateAttributes(updates, next);
      };
      return this._each(this, iterator, callback);
    } else {
      return this.store.update(updates, this, callback);
    }
  };

  Criteria.prototype.destroy = function(callback) {
    var iterator;
    if (this.instantiate) {
      iterator = function(record, next) {
        return record.destroy(next);
      };
      return this._each(this, iterator, callback);
    } else {
      return this.store.destroy(this, callback);
    }
  };

  Criteria.prototype.find = function(callback) {
    if (this.one) {
      return this.store.findOne(this, callback);
    } else {
      return this.store.find(this, callback);
    }
  };

  Criteria.prototype.findOne = function(callback) {
    return this.store.findOne(this, callback);
  };

  Criteria.prototype.count = function(callback) {
    return this.store.count(this, callback);
  };

  Criteria.prototype.exists = function(callback) {
    return this.store.exists(this, callback);
  };

  Criteria.prototype.explain = function(callback) {};

  Criteria.prototype.clone = function() {
    return (new this.constructor({
      model: this.model,
      instantiate: this.instantiate
    })).merge(this);
  };

  Criteria.prototype.merge = function(criteria) {
    this._where = this._where.concat(criteria._where);
    this._order = this._order.concat(criteria._order);
    this._offset = criteria._offset;
    this._limit = criteria._limit;
    this._fields = criteria._fields;
    this._except = criteria._except;
    this._includes = criteria._includes;
    this._joins = _.extend({}, criteria._joins);
    this._eagerLoad = _.extend({}, criteria._eagerLoad);
    return this;
  };

  Criteria.prototype.toJSON = function() {
    return {
      where: this._where,
      order: this._order,
      offset: this._offset,
      limit: this._limit,
      fields: this._fields,
      except: this._except,
      includes: this._includes,
      joins: this._joins,
      eagerLoad: this._eagerLoad
    };
  };

  Criteria.prototype.conditions = function() {
    var conditions, result, _i, _len, _ref;
    result = {};
    _ref = this._where;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      conditions = _ref[_i];
      _.deepMergeWithArrays(result, conditions);
    }
    return result;
  };

  Criteria.prototype.attributes = function() {
    var attributes, conditions, key, value, _i, _key, _len, _ref, _value;
    attributes = {};
    _ref = this._where;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      conditions = _ref[_i];
      for (key in conditions) {
        value = conditions[key];
        if (Tower.Store.isKeyword(key)) {
          for (_key in value) {
            _value = value[_key];
            attributes[_key] = _value;
          }
        } else if (_.isHash(value) && value.constructor.name === "Object" && Tower.Store.hasKeyword(value)) {
          for (_key in value) {
            _value = value[_key];
            attributes[key] = _value;
          }
        } else {
          attributes[key] = value;
        }
      }
    }
    for (key in attributes) {
      value = attributes[key];
      if (value === void 0) delete attributes[key];
    }
    return attributes;
  };

  Criteria.prototype._whereOperator = function(operator, attributes) {
    var key, query, value;
    query = {};
    for (key in attributes) {
      value = attributes[key];
      query[key] = {};
      query[key][operator] = value;
    }
    return this.where(query);
  };

  Criteria.prototype._each = function(criteria, iterator, callback) {
    var _this = this;
    return this.store.find(criteria, function(error, records) {
      if (error) {
        return callback.call(_this, error, records);
      } else {
        return Tower.parallel(records, iterator, function(error) {
          if (!callback) {
            if (error) throw error;
          } else {
            if (callback) return callback.call(_this, error, records);
          }
        });
      }
    });
  };

  Criteria.prototype._array = function(existing, orNull) {
    if (existing && existing.length) {
      return existing.concat();
    } else {
      if (orNull) {
        return null;
      } else {
        return [];
      }
    }
  };

  return Criteria;

})();

module.exports = Tower.Model.Criteria;
