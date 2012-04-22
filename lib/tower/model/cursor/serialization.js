
Tower.Model.Cursor.Serialization = {
  initialize: function(options) {
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
    return this._near = options.near;
  },
  get: function(key) {
    return this["_" + key];
  },
  "export": function(result) {
    if (this.returnArray === false) {
      result = result[0];
    }
    delete this.data;
    delete this.returnArray;
    return result;
  },
  addData: function(args) {
    if (args.length && args.length > 1 || _.isArray(args[0])) {
      this.data = _.flatten(args);
      return this.returnArray = true;
    } else {
      this.data = _.flatten([args]);
      return this.returnArray = false;
    }
  },
  addIds: function(args) {
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
  },
  has: function(object) {
    return false;
  },
  compile: function() {},
  explain: function(callback) {},
  clone: function() {
    return (new this.constructor({
      model: this.model,
      instantiate: this.instantiate
    })).merge(this);
  },
  merge: function(cursor) {
    this._where = this._where.concat(cursor._where);
    this._order = this._order.concat(cursor._order);
    this._offset = cursor._offset;
    this._limit = cursor._limit;
    this._fields = cursor._fields;
    this._except = cursor._except;
    this._includes = cursor._includes;
    this._joins = _.extend({}, cursor._joins);
    this._eagerLoad = _.extend({}, cursor._eagerLoad);
    this._near = cursor._near;
    return this;
  },
  toJSON: function() {
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
  },
  conditions: function() {
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
      if (this.store.constructor.className() === "Memory") {
        ids = _.map(ids, function(id) {
          return id.toString();
        });
      }
      result.id = {
        $in: ids
      };
    }
    return result;
  },
  attributes: function() {
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
  },
  _each: function(cursor, iterator, callback) {
    var data,
      _this = this;
    data = !!cursor.data;
    return this.store.find(cursor, function(error, records) {
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
  },
  _array: function(existing, orNull) {
    if (existing && existing.length) {
      return existing.concat();
    } else {
      if (orNull) {
        return null;
      } else {
        return [];
      }
    }
  }
};

module.exports = Tower.Model.Cursor.Serialization;
