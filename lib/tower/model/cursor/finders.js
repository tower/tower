
Tower.Model.Cursor.Finders = {
  find: function(callback) {
    return this._find(callback);
  },
  _find: function(callback) {
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
  }
};

module.exports = Tower.Model.Cursor.Finders;
