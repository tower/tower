var _,
  __slice = [].slice;

_ = Tower._;

Tower.ModelCursorOperations = Ember.Mixin.create({
  refreshInterval: function(milliseconds) {},
  invalidate: function() {
    return this._invalidated = true;
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
    var object;
    if (conditions.isCursor) {
      this.merge(conditions);
    } else if (arguments.length === 2) {
      object = {};
      object[arguments[0]] = arguments[1];
      this._where.push(object);
    } else {
      this._where.push(conditions);
    }
    this.invalidate();
    return this;
  },
  order: function(attribute, direction) {
    var value;
    if (direction == null) {
      direction = 'asc';
    }
    value = _.isArray(attribute) ? attribute : [attribute, direction];
    this._order.push(value);
    this.invalidate();
    return this;
  },
  reverseSort: function() {
    var i, order, orderItem, _i, _len;
    order = this.getCriteria('order');
    if (!order.length) {
      order = this._order = [['createdAt', 'asc']];
    }
    for (i = _i = 0, _len = order.length; _i < _len; i = ++_i) {
      orderItem = order[i];
      orderItem[1] = orderItem[1] === 'asc' ? 'desc' : 'asc';
    }
    order;

    this.invalidate();
    return this;
  },
  asc: function() {
    var attribute, attributes, _i, _len;
    attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (_i = 0, _len = attributes.length; _i < _len; _i++) {
      attribute = attributes[_i];
      this.order(attribute);
    }
    return this;
  },
  desc: function() {
    var attribute, attributes, _i, _len;
    attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (_i = 0, _len = attributes.length; _i < _len; _i++) {
      attribute = attributes[_i];
      this.order(attribute, 'desc');
    }
    return this;
  },
  ne: function() {
    return this._whereOperator.apply(this, ['$neq'].concat(__slice.call(arguments)));
  },
  gte: function() {
    return this._whereOperator.apply(this, ['$gte'].concat(__slice.call(arguments)));
  },
  lte: function() {
    return this._whereOperator.apply(this, ['$lte'].concat(__slice.call(arguments)));
  },
  gt: function() {
    return this._whereOperator.apply(this, ['$gt'].concat(__slice.call(arguments)));
  },
  lt: function() {
    return this._whereOperator.apply(this, ['$lt'].concat(__slice.call(arguments)));
  },
  allIn: function() {
    return this._whereOperator.apply(this, ['$all'].concat(__slice.call(arguments)));
  },
  anyIn: function() {
    return this._whereOperator.apply(this, ['$any'].concat(__slice.call(arguments)));
  },
  notIn: function() {
    return this._whereOperator.apply(this, ['$nin'].concat(__slice.call(arguments)));
  },
  offset: function(number) {
    this._offset = number;
    this.invalidate();
    return this;
  },
  limit: function(number) {
    this._limit = number;
    if (number === 1) {
      this.returnArray = false;
    } else {
      delete this.returnArray;
    }
    this.invalidate();
    return this;
  },
  select: function() {
    this._fields = _.flatten(_.args(arguments));
    this.invalidate();
    return this;
  },
  includes: function() {
    this._includes = _.flatten(_.args(arguments));
    this.invalidate();
    return this;
  },
  uniq: function(value) {
    this._uniq = value;
    this.invalidate();
    return this;
  },
  page: function(page) {
    var limit;
    this.limit(this._limit || Tower.ModelCursor.prototype.defaultLimit);
    limit = this.getCriteria('limit');
    Ember.set(this, 'currentPage', page);
    return this.offset((Math.max(1, page) - 1) * limit);
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
    return Tower.StoreOperators.test(record, this.conditions());
  },
  testEach: function(records, callback) {
    var conditions;
    conditions = this.conditions();
    delete conditions.type;
    return Tower.StoreOperators.testEach(records, conditions, callback);
  },
  eagerLoad: function(records, callback) {
    var eagerLoad, hash, includes, item, keys, _i, _len, _ref,
      _this = this;
    if (!(records && records.length)) {
      return callback();
    }
    includes = this.getCriteria('includes');
    if (_.isBlank(includes)) {
      return callback();
    }
    hash = {};
    _ref = _.flatten(includes);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (typeof item === 'string') {
        hash[item] = null;
      } else {
        _.extend(hash, item);
      }
    }
    keys = _.keys(hash);
    eagerLoad = function(key, done) {
      var childKeys, ids, relation, scope;
      childKeys = hash[key];
      relation = _this.model.relations()[key];
      if (relation.isHasOne) {
        ids = records.getEach('id');
        scope = relation.klass().anyIn(relation.foreignKey, ids);
        if (childKeys) {
          scope = scope.includes(childKeys);
        }
        return scope.all(function(error, associated) {
          var record, _j, _k, _len1, _len2;
          for (_j = 0, _len1 = records.length; _j < _len1; _j++) {
            record = records[_j];
            for (_k = 0, _len2 = associated.length; _k < _len2; _k++) {
              item = associated[_k];
              if (record.get('id').toString() === item.get(relation.foreignKey).toString()) {
                record.set(relation.name, item);
              }
            }
          }
          return done();
        });
      } else if (relation.isHasMany && !relation.isHasManyThrough) {
        ids = records.getEach('id');
        scope = relation.klass().anyIn(relation.foreignKey, ids);
        if (childKeys) {
          scope = scope.includes(childKeys);
        }
        return scope.all(function(error, associated) {
          var matches, record, _j, _k, _len1, _len2;
          for (_j = 0, _len1 = records.length; _j < _len1; _j++) {
            record = records[_j];
            matches = [];
            for (_k = 0, _len2 = associated.length; _k < _len2; _k++) {
              item = associated[_k];
              if (record.get('id').toString() === item.get(relation.foreignKey).toString()) {
                matches.push(item);
              }
            }
            record.get(relation.name).load(matches);
          }
          return done();
        });
      } else {
        ids = records.getEach(relation.foreignKey);
        scope = relation.klass().anyIn({
          id: ids
        });
        if (childKeys) {
          scope = scope.includes(childKeys);
        }
        return scope.all(function(error, associated) {
          var record, _j, _k, _len1, _len2;
          for (_j = 0, _len1 = records.length; _j < _len1; _j++) {
            record = records[_j];
            for (_k = 0, _len2 = associated.length; _k < _len2; _k++) {
              item = associated[_k];
              if (record.get(relation.foreignKey).toString() === item.get('id').toString()) {
                record.set(relation.name, item);
              }
            }
          }
          return done();
        });
      }
    };
    return Tower.parallel(keys, eagerLoad, callback);
  },
  _whereOperator: function(operator, attributes) {
    var attrs, key, query, value;
    query = {};
    if (typeof attributes === 'string') {
      attrs = {};
      attrs[arguments[1]] = arguments[2];
      attributes = attrs;
    }
    for (key in attributes) {
      value = attributes[key];
      query[key] = {};
      query[key][operator] = value;
    }
    return this.where(query);
  }
});

Tower.ModelCursorOperations.sort = Tower.ModelCursorOperations.order;

module.exports = Tower.ModelCursorOperations;
