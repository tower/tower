
Tower.Model.Cursor.Finders = {
  ClassMethods: {
    subscriptions: [],
    pushMatching: function(records) {
      return this.applyMatching('pushMatching', records);
    },
    pullMatching: function(records) {
      return this.applyMatching('pullMatching', records);
    },
    applyMatching: function(method, records) {
      var app, key, subscriptions, _i, _len;
      subscriptions = Tower.Model.Cursor.subscriptions;
      if (!subscriptions.length) {
        return records;
      }
      app = Tower.Application.instance();
      for (_i = 0, _len = subscriptions.length; _i < _len; _i++) {
        key = subscriptions[_i];
        app[key][method](records);
      }
      return records;
    }
  },
  find: function(callback) {
    return this._find(callback);
  },
  _find: function(callback) {
    var _this = this;
    if (this.one) {
      this.store.findOne(this, callback);
    } else {
      this.store.find(this, function(error, records) {
        if (!error && records.length) {
          records = _this["export"](records);
        }
        if (callback) {
          callback.call(_this, error, records);
        }
        return records;
      });
    }
    return this;
  },
  findOne: function(callback) {
    this.limit(1);
    this.returnArray = false;
    return this.find(callback);
  },
  count: function(callback) {
    return this._count(callback);
  },
  _count: function(callback) {
    return this.store.count(this, callback);
  },
  exists: function(callback) {
    return this._exists(callback);
  },
  _exists: function(callback) {
    return this.store.exists(this, callback);
  },
  getType: function() {
    return this.model;
  },
  pushMatching: function(records) {
    var matching;
    matching = Tower.Store.Operators.select(records, this.conditions());
    this.addObjects(matching);
    return matching;
  },
  pullMatching: function(records) {
    var matching;
    matching = Tower.Store.Operators.select(records, this.conditions());
    this.removeObjects(matching);
    return matching;
  },
  pullNotMatching: function(records) {
    var notMatching;
    notMatching = Tower.Store.Operators.notMatching(records, this.conditions());
    this.removeObjects(notMatching);
    return notMatching;
  }
};

module.exports = Tower.Model.Cursor.Finders;
