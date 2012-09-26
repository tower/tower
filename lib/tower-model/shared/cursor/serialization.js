var _;

_ = Tower._;

Tower.ModelCursorSerialization = Ember.Mixin.create({
  isCursor: true,
  make: function(options) {
    if (options == null) {
      options = {};
    }
    _.extend(this, options);
    this.model || (this.model = options.model);
    this.store = this.model ? this.model.store() : void 0;
    this.instantiate = options.instantiate !== false;
    this._where = options.where || [];
    this._joins = options.joins || {};
    this._order = this._array(options.order);
    this._data = this._array(options.data);
    this._except = this._array(options.except, true);
    this._includes = this._array(options.includes, true);
    this._offset = options.offset;
    this._limit = options.limit;
    this._fields = options.fields;
    this._uniq = options.uniq;
    this._eagerLoad = options.eagerLoad || {};
    this._near = options.near;
    return Ember.set(this, 'content', Ember.A([]));
  },
  getCriteria: function(key) {
    return this["_" + key];
  },
  observableFields: Ember.computed(function() {
    var data, fields, orderItem, _i, _len, _ref;
    data = this.toParams();
    fields = [];
    if (data.sort) {
      _ref = data.sort;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        orderItem = _ref[_i];
        fields.push(orderItem[0]);
      }
    }
    fields = _.uniq(fields.concat(_.keys(data.conditions)));
    return fields;
  }).cacheable(),
  observableTypes: Ember.computed(function() {
    return [this.model.className()];
  }).cacheable(),
  observable: function(falseFlag) {
    if (falseFlag === false) {
      Tower.removeCursor(this);
    } else {
      Tower.addCursor(this);
    }
    return this;
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
  clone: function(cloneContent) {
    var clone, content;
    if (cloneContent == null) {
      cloneContent = true;
    }
    clone = this.constructor.create();
    if (cloneContent) {
      content = Ember.get(this, 'content') || Ember.A([]);
      if (content) {
        clone.setProperties({
          content: content
        });
      }
    }
    clone.make({
      model: this.model,
      instantiate: this.instantiate
    });
    clone.merge(this);
    return clone;
  },
  load: function(records) {
    return Ember.set(this, 'content', records);
  },
  reset: function() {
    return Ember.set(this, 'content', []);
  },
  refresh: function(callback) {
    this.reset();
    return this.all(callback);
  },
  stringify: function(pretty) {
    return _.stringify(this, pretty);
  },
  merge: function(cursor) {
    this._where = this._where.concat(cursor._where);
    this._order = this._order.concat(cursor._order);
    this._offset = cursor._offset;
    this._limit = cursor._limit;
    this._fields = cursor._fields;
    this._except = cursor._except;
    if (cursor._includes && cursor._includes.length) {
      this._includes = cursor._includes;
    }
    this.currentPage = cursor.currentPage;
    this._joins = _.extend({}, cursor._joins);
    this._eagerLoad = _.extend({}, cursor._eagerLoad);
    this._near = cursor._near;
    this.returnArray = cursor.returnArray;
    return this;
  },
  toParams: function() {
    var conditions, data, includes, key, limit, operator, operators, page, sort, value, _key, _value;
    data = {};
    sort = this._order;
    conditions = this.conditions();
    page = this.currentPage;
    limit = this._limit;
    includes = this._includes;
    if (sort && sort.length) {
      data.sort = sort;
    }
    operators = Tower.StoreOperators.MAP;
    if (conditions) {
      for (key in conditions) {
        value = conditions[key];
        if (_.isRegExp(value)) {
          conditions[key] = {
            '=~': value.source
          };
        } else if (_.isHash(value)) {
          for (_key in value) {
            _value = value[_key];
            if (operator = operators[_key] && _.isRegExp(_value)) {
              if (operator === '$notMatch') {
                delete value[_key];
                value['=~'] === ("^.*(?!" + _value.source + ").*$");
              } else {
                value[_key] = _value.source;
              }
            }
          }
        }
      }
      data.conditions = conditions;
    }
    if (page) {
      data.page = page;
    }
    if (limit && limit) {
      data.limit = limit;
    }
    if (includes && includes.length) {
      data.includes = includes;
    }
    return data;
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
        } else if (_.isHash(value) && value.constructor.name === 'Object' && Tower.Store.hasKeyword(value)) {
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
  _compileAttributes: function(object, conditions) {
    var key, oldValue, value, _results;
    _results = [];
    for (key in conditions) {
      value = conditions[key];
      oldValue = result[key];
      if (oldValue) {
        if (_.isArray(oldValue)) {
          _results.push(object[key] = oldValue.concat(value));
        } else if (typeof oldValue === 'object' && typeof value === 'object') {
          _results.push(object[key] = Tower.SupportObject.deepMergeWithArrays(object[key], value));
        } else {
          _results.push(object[key] = value);
        }
      } else {
        _results.push(object[key] = value);
      }
    }
    return _results;
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
});

module.exports = Tower.ModelCursorSerialization;
