var _;

_ = Tower._;

Tower.ControllerParams = {
  ClassMethods: {
    param: function(key, options) {
      if (options == null) {
        options = {};
      }
      options.resourceType = this.metadata().resourceType;
      return this.params()[key] = Tower.NetParam.create(key, options);
    },
    params: function() {
      var arg, key, value, _i, _len;
      if (arguments.length) {
        for (_i = 0, _len = arguments.length; _i < _len; _i++) {
          arg = arguments[_i];
          if (typeof arg === 'object') {
            for (key in arg) {
              value = arg[key];
              this.param(key, value);
            }
          } else {
            this.param(arg);
          }
        }
      }
      return this.metadata().params;
    },
    _buildCursorFromGet: function(params, cursor) {
      var fields, name, object, parser, parsers;
      parsers = this.params();
      for (name in parsers) {
        parser = parsers[name];
        if (params.hasOwnProperty(name)) {
          if (name === 'sort') {
            cursor.order(parser.parse(params[name]));
          } else if (name === 'fields') {
            fields = _.select(_.flatten(parser.parse(params[name])), function(i) {
              return i.value;
            });
            fields = _.flatten(_.map(fields, function(i) {
              return i.value;
            }));
            cursor.select(fields);
          } else if (name === 'limit') {
            cursor.limit(parser.extractValue(params[name]));
          } else if (name === 'page') {
            cursor.page(parser.extractValue(params[name]));
          } else if (typeof params[name] === 'string') {
            cursor.where(parser.toCursor(params[name]));
          } else {
            object = {};
            object[name] = params[name];
            cursor.where(object);
          }
        }
      }
      return cursor;
    }
  },
  cursor: function() {
    var cursor;
    if (this._cursor) {
      return this._cursor;
    }
    cursor = Tower.ModelCursor.create();
    cursor.make();
    if (this.params.conditions) {
      this._cursor = this._buildCursorFromPost(cursor);
    } else {
      this._cursor = this._buildCursorFromGet(cursor);
    }
    return this._cursor;
  },
  _buildCursorFromPost: function(cursor) {
    var cleanConditions, conditions, limit, page, params, parsers, sort;
    parsers = this.constructor.params();
    params = this.params;
    conditions = this.params.conditions;
    page = this.params.page;
    limit = this.params.limit;
    sort = this.params.sort;
    cleanConditions = function(hash) {
      var item, key, value, _i, _len;
      for (key in hash) {
        value = hash[key];
        if (key === '$or' || key === '$nor') {
          for (_i = 0, _len = value.length; _i < _len; _i++) {
            item = value[_i];
            cleanConditions(item);
          }
        } else {
          if (!(parsers.hasOwnProperty(key) || key.match(/id$/i))) {
            delete hash[key];
          }
        }
      }
      return hash;
    };
    conditions = cleanConditions(conditions);
    cursor.where(conditions);
    if (sort && sort.length) {
      cursor.order(sort);
    }
    if (limit) {
      cursor.limit(limit);
    }
    if (page) {
      cursor.page(page);
    }
    return cursor;
  },
  _buildCursorFromGet: function(cursor) {
    return this.constructor._buildCursorFromGet(this.get('params'), cursor);
  }
};

module.exports = Tower.ControllerParams;
