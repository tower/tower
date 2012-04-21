var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend(child);
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
},
  __slice = [].slice;

Tower.Model.Criteria = (function(_super) {
  var Criteria;

  Criteria = __extends(Criteria, _super);

  __defineProperty(Criteria,  "defaultLimit", 20);

  Criteria.include(Tower.Support.Callbacks);

  function Criteria(options) {
    if (options == null) {
      options = {};
    }
    this.model = options.model;
    this.store = this.model ? this.model.store() : void 0;
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
    this._near = options.near;
  }

  __defineProperty(Criteria,  "export", function(result) {
    if (this.returnArray === false) {
      result = result[0];
    }
    delete this.data;
    delete this.returnArray;
    return result;
  });

  __defineProperty(Criteria,  "get", function(key) {
    return this["_" + key];
  });

  __defineProperty(Criteria,  "addData", function(args) {
    if (args.length && args.length > 1 || _.isArray(args[0])) {
      this.data = _.flatten(args);
      return this.returnArray = true;
    } else {
      this.data = _.flatten([args]);
      return this.returnArray = false;
    }
  });

  __defineProperty(Criteria,  "addIds", function(args) {
    var id, ids, object, _i, _len;
    ids = this.ids || (this.ids = []);
    if (args.length) {
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        object = args[_i];
        if (object == null) {
          continue;
        }
        id = object instanceof Tower.Model ? object.get('id') : object;
        if (ids.indexOf(id) === -1) {
          ids.push(id);
        }
      }
    }
    return ids;
  });

  __defineProperty(Criteria,  "eagerLoad", function(object) {
    return this._eagerLoad = _.extend(this._eagerLoad, object);
  });

  __defineProperty(Criteria,  "has", function(object) {
    return false;
  });

  __defineProperty(Criteria,  "joins", function(object) {
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
  });

  __defineProperty(Criteria,  "except", function() {
    return this._except = _.flatten(_.args(arguments));
  });

  __defineProperty(Criteria,  "where", function(conditions) {
    if (conditions instanceof Tower.Model.Criteria) {
      return this.merge(conditions);
    } else {
      return this._where.push(conditions);
    }
  });

  __defineProperty(Criteria,  "order", function(attribute, direction) {
    if (direction == null) {
      direction = "asc";
    }
    return this._order.push([attribute, direction]);
  });

  __defineProperty(Criteria,  "sort", Criteria.prototype.order);

  __defineProperty(Criteria,  "reverseSort", function() {
    var i, order, set, _i, _len;
    order = this.get('order');
    for (i = _i = 0, _len = order.length; _i < _len; i = ++_i) {
      set = order[i];
      set[1] = set[1] === "asc" ? "desc" : "asc";
    }
    return order;
  });

  __defineProperty(Criteria,  "asc", function() {
    var attribute, attributes, _i, _len;
    attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (_i = 0, _len = attributes.length; _i < _len; _i++) {
      attribute = attributes[_i];
      this.order(attribute);
    }
    return this._order;
  });

  __defineProperty(Criteria,  "desc", function() {
    var attribute, attributes, _i, _len;
    attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (_i = 0, _len = attributes.length; _i < _len; _i++) {
      attribute = attributes[_i];
      this.order(attribute, "desc");
    }
    return this._order;
  });

  __defineProperty(Criteria,  "gte", function() {});

  __defineProperty(Criteria,  "lte", function() {});

  __defineProperty(Criteria,  "gt", function() {});

  __defineProperty(Criteria,  "lt", function() {});

  __defineProperty(Criteria,  "allIn", function(attributes) {
    return this._whereOperator("$all", attributes);
  });

  __defineProperty(Criteria,  "anyIn", function(attributes) {
    return this._whereOperator("$any", attributes);
  });

  __defineProperty(Criteria,  "notIn", function(attributes) {
    return this._whereOperator("$nin", attributes);
  });

  __defineProperty(Criteria,  "offset", function(number) {
    return this._offset = number;
  });

  __defineProperty(Criteria,  "limit", function(number) {
    return this._limit = number;
  });

  __defineProperty(Criteria,  "select", function() {
    return this._fields = _.flatten(_.args(fields));
  });

  __defineProperty(Criteria,  "includes", function() {
    return this._includes = _.flatten(_.args(arguments));
  });

  __defineProperty(Criteria,  "uniq", function(value) {
    return this._uniq = value;
  });

  __defineProperty(Criteria,  "page", function(page) {
    var limit;
    limit = this.limit(this._limit || this.defaultLimit);
    return this.offset((Math.max(1, page) - 1) * limit);
  });

  __defineProperty(Criteria,  "paginate", function(options) {
    var limit, page;
    limit = options.perPage || options.limit;
    page = options.page || 1;
    this.limit(limit);
    return this.offset((page - 1) * limit);
  });

  __defineProperty(Criteria,  "near", function(coordinates) {
    return this.where({
      coordinates: {
        $near: coordinates
      }
    });
  });

  __defineProperty(Criteria,  "within", function(bounds) {
    return this.where({
      coordinates: {
        $maxDistance: bounds
      }
    });
  });

  __defineProperty(Criteria,  "build", function(callback) {
    return this._build(callback);
  });

  __defineProperty(Criteria,  "_build", function(callback) {
    var attributes, data, item, result, store, _i, _len;
    store = this.store;
    attributes = this.attributes();
    data = this.data;
    if (!data.length) {
      data.push({});
    }
    result = [];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      item = data[_i];
      if (item instanceof Tower.Model) {
        _.extend(item.attributes, attributes, item.attributes);
      } else {
        item = store.serializeModel(_.extend({}, attributes, item));
      }
      result.push(item);
    }
    result = this.returnArray ? result : result[0];
    if (callback) {
      callback.call(this, null, result);
    }
    return result;
  });

  __defineProperty(Criteria,  "create", function(callback) {
    return this._create(callback);
  });

  __defineProperty(Criteria,  "_create", function(callback) {
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
          if (error) {
            throw error;
          }
          if (!returnArray) {
            return records = records[0];
          }
        } else {
          if (error) {
            return callback(error);
          }
          if (!returnArray) {
            records = records[0];
          }
          return callback(error, records);
        }
      });
    } else {
      this.store.create(this, callback);
    }
    return records;
  });

  __defineProperty(Criteria,  "update", function(callback) {
    return this._update(callback);
  });

  __defineProperty(Criteria,  "_update", function(callback) {
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
  });

  __defineProperty(Criteria,  "destroy", function(callback) {
    return this._destroy(callback);
  });

  __defineProperty(Criteria,  "_destroy", function(callback) {
    var iterator;
    if (this.instantiate) {
      iterator = function(record, next) {
        return record.destroy(next);
      };
      return this._each(this, iterator, callback);
    } else {
      return this.store.destroy(this, callback);
    }
  });

  __defineProperty(Criteria,  "find", function(callback) {
    return this._find(callback);
  });

  __defineProperty(Criteria,  "_find", function(callback) {
    var _this = this;
    if (this.one) {
      return this.store.findOne(this, callback);
    } else {
      return this.store.find(this, function(error, records) {
        if (!error && records.length) {
          records = _this["export"](records);
        }
        if (callback) {
          callback.call(_this, error, records);
        }
        return records;
      });
    }
  });

  __defineProperty(Criteria,  "findOne", function(callback) {
    this.limit(1);
    this.returnArray = false;
    return this.find(callback);
  });

  __defineProperty(Criteria,  "count", function(callback) {
    return this._count(callback);
  });

  __defineProperty(Criteria,  "_count", function(callback) {
    return this.store.count(this, callback);
  });

  __defineProperty(Criteria,  "exists", function(callback) {
    return this._exists(callback);
  });

  __defineProperty(Criteria,  "_exists", function(callback) {
    return this.store.exists(this, callback);
  });

  __defineProperty(Criteria,  "add", function(callback) {});

  __defineProperty(Criteria,  "remove", function(callback) {});

  __defineProperty(Criteria,  "explain", function(callback) {});

  __defineProperty(Criteria,  "clone", function() {
    return (new this.constructor({
      model: this.model,
      instantiate: this.instantiate
    })).merge(this);
  });

  __defineProperty(Criteria,  "merge", function(criteria) {
    this._where = this._where.concat(criteria._where);
    this._order = this._order.concat(criteria._order);
    this._offset = criteria._offset;
    this._limit = criteria._limit;
    this._fields = criteria._fields;
    this._except = criteria._except;
    this._includes = criteria._includes;
    this._joins = _.extend({}, criteria._joins);
    this._eagerLoad = _.extend({}, criteria._eagerLoad);
    this._near = criteria._near;
    return this;
  });

  __defineProperty(Criteria,  "toJSON", function() {
    return {
      where: this._where,
      order: this._order,
      offset: this._offset,
      limit: this._limit,
      fields: this._fields,
      except: this._except,
      includes: this._includes,
      joins: this._joins,
      eagerLoad: this._eagerLoad,
      near: this._near
    };
  });

  __defineProperty(Criteria,  "conditions", function() {
    var conditions, ids, result, _i, _len, _ref;
    result = {};
    _ref = this._where;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      conditions = _ref[_i];
      _.deepMergeWithArrays(result, conditions);
    }
    if (this.ids && this.ids.length) {
      delete result.id;
      if (this.ids.length === 1) {
        this.returnArray = false;
      } else {
        this.returnArray = true;
      }
      ids = this.ids;
      if (this.store.constructor.name === "Memory") {
        ids = _.map(ids, function(id) {
          return id.toString();
        });
      }
      result.id = {
        $in: ids
      };
    }
    return result;
  });

  __defineProperty(Criteria,  "attributes", function() {
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
      if (value === void 0) {
        delete attributes[key];
      }
    }
    return attributes;
  });

  __defineProperty(Criteria,  "_whereOperator", function(operator, attributes) {
    var key, query, value;
    query = {};
    for (key in attributes) {
      value = attributes[key];
      query[key] = {};
      query[key][operator] = value;
    }
    return this.where(query);
  });

  __defineProperty(Criteria,  "_each", function(criteria, iterator, callback) {
    var data,
      _this = this;
    data = !!criteria.data;
    return this.store.find(criteria, function(error, records) {
      if (error) {
        return callback.call(_this, error, records);
      } else {
        return Tower.parallel(records, iterator, function(error) {
          if (!callback) {
            if (error) {
              throw error;
            }
          } else {
            if (callback) {
              return callback.call(_this, error, _this["export"](records));
            }
          }
        });
      }
    });
  });

  __defineProperty(Criteria,  "_array", function(existing, orNull) {
    if (existing && existing.length) {
      return existing.concat();
    } else {
      if (orNull) {
        return null;
      } else {
        return [];
      }
    }
  });

  return Criteria;

})(Tower.Class);

module.exports = Tower.Model.Criteria;
