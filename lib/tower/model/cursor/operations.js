var __slice = [].slice;

Tower.Model.Cursor.Operations = {
  eagerLoad: function(object) {
    return this._eagerLoad = _.extend(this._eagerLoad, object);
  },
  joins: function(object) {
    var joins, key, _i, _len;
    joins = this._joins;
    if (_.isArray(object)) {
      for (_i = 0, _len = object.length; _i < _len; _i++) {
        key = object[_i];
        joins[key] = true;
      }
    } else if (typeof object === 'string') {
      joins[object] = true;
    } else {
      _.extend(joins, object);
    }
    return joins;
  },
  except: function() {
    return this._except = _.flatten(_.args(arguments));
  },
  "with": function(transaction) {
    return this.transaction = transaction;
  },
  where: function(conditions) {
    if (conditions instanceof Tower.Model.Cursor) {
      return this.merge(conditions);
    } else {
      return this._where.push(conditions);
    }
  },
  order: function(attribute, direction) {
    if (direction == null) {
      direction = 'asc';
    }
    return this._order.push([attribute, direction]);
  },
  reverseSort: function() {
    var i, order, set, _i, _len;
    order = this.get('order');
    for (i = _i = 0, _len = order.length; _i < _len; i = ++_i) {
      set = order[i];
      set[1] = set[1] === 'asc' ? 'desc' : 'asc';
    }
    return order;
  },
  asc: function() {
    var attribute, attributes, _i, _len;
    attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (_i = 0, _len = attributes.length; _i < _len; _i++) {
      attribute = attributes[_i];
      this.order(attribute);
    }
    return this._order;
  },
  desc: function() {
    var attribute, attributes, _i, _len;
    attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (_i = 0, _len = attributes.length; _i < _len; _i++) {
      attribute = attributes[_i];
      this.order(attribute, 'desc');
    }
    return this._order;
  },
  gte: function() {},
  lte: function() {},
  gt: function() {},
  lt: function() {},
  allIn: function(attributes) {
    return this._whereOperator('$all', attributes);
  },
  anyIn: function(attributes) {
    return this._whereOperator('$any', attributes);
  },
  notIn: function(attributes) {
    return this._whereOperator('$nin', attributes);
  },
  offset: function(number) {
    return this._offset = number;
  },
  limit: function(number) {
    return this._limit = number;
  },
  select: function() {
    return this._fields = _.flatten(_.args(fields));
  },
  includes: function() {
    return this._includes = _.flatten(_.args(arguments));
  },
  uniq: function(value) {
    return this._uniq = value;
  },
  page: function(page) {
    var limit;
    limit = this.limit(this._limit || this.defaultLimit);
    return this.offset((Math.max(1, page) - 1) * limit);
  },
  paginate: function(options) {
    var limit, page;
    limit = options.perPage || options.limit;
    page = options.page || 1;
    this.limit(limit);
    return this.offset((page - 1) * limit);
  },
  near: function(coordinates) {
    return this.where({
      coordinates: {
        $near: coordinates
      }
    });
  },
  within: function(bounds) {
    return this.where({
      coordinates: {
        $maxDistance: bounds
      }
    });
  },
  test: function(record) {
    return Tower.Store.Operators.test(record, this.conditions());
  },
  _whereOperator: function(operator, attributes) {
    var key, query, value;
    query = {};
    for (key in attributes) {
      value = attributes[key];
      query[key] = {};
      query[key][operator] = value;
    }
    return this.where(query);
  }
};

Tower.Model.Cursor.Operations.sort = Tower.Model.Cursor.Operations.order;

module.exports = Tower.Model.Cursor.Operations;
