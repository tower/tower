var action, phase, _, _fn, _i, _j, _len, _len1, _ref, _ref1,
  _this = this;

_ = Tower._;

Tower.ModelCursorFinders = {
  hasFirstPage: false,
  hasPreviousPage: false,
  hasNextPage: false,
  hasLastPage: false,
  isEmpty: true,
  totalCount: 0,
  totalPageCount: 0,
  currentPage: 0,
  firstPage: function() {
    this.page(1);
    return this;
  },
  lastPage: function() {
    this.page(this.totalPageCount);
    return this;
  },
  nextPage: function() {
    this.page(this.currentPage + 1);
    return this;
  },
  previousPage: function() {
    this.page(this.currentPage - 1);
    return this;
  },
  all: function(callback) {
    delete this.returnArray;
    return this.find(callback);
  },
  find: function(callback) {
    return this._find(callback);
  },
  findOne: function(callback) {
    this.limit(1);
    this.returnArray = false;
    return this.find(callback);
  },
  count: function(callback) {
    return this._count(callback);
  },
  exists: function(callback) {
    return this._exists(callback);
  },
  fetch: function(callback) {
    return this.store.fetch(this, callback);
  },
  mergeCreatedRecords: function(records) {
    return this.pushMatching(records);
  },
  mergeUpdatedRecords: function(records) {
    this.pushMatching(records);
    return this.pullNotMatching(records);
  },
  mergeDeletedRecords: function(records) {
    return this.pullMatching(records);
  },
  pushMatching: function(records) {
    var item, matching, _i, _len;
    if (records.length === 0 || records[0].constructor.toString() !== this.store.className) {
      return [];
    }
    matching = Tower.StoreOperators.select(records, this.conditions());
    Ember.beginPropertyChanges(this);
    for (_i = 0, _len = matching.length; _i < _len; _i++) {
      item = matching[_i];
      if (!this.contains(item)) {
        this.addObject(item);
      }
    }
    Ember.endPropertyChanges(this);
    return matching;
  },
  pullMatching: function(records) {
    var matching;
    if (records.length === 0 || records[0].constructor.toString() !== this.store.className) {
      return [];
    }
    matching = Tower.StoreOperators.select(records, this.conditions());
    this.removeObjects(matching);
    return matching;
  },
  pullNotMatching: function(records) {
    var notMatching;
    if (records.length === 0 || records[0].constructor.toString() !== this.store.className) {
      return [];
    }
    notMatching = Tower.StoreOperators.notMatching(records, this.conditions());
    this.removeObjects(notMatching);
    return notMatching;
  },
  commit: function() {
    var content;
    Ember.beginPropertyChanges(this);
    content = this.get('content');
    this.mergeUpdatedRecords(content);
    return Ember.endPropertyChanges(this);
  },
  _find: function(callback) {
    var result, returnArray,
      _this = this;
    returnArray = this.returnArray;
    result = void 0;
    if (this.one) {
      this.store.findOne(this, callback);
    } else {
      this.store.find(this, function(error, records) {
        if (records) {
          if (_this.returnArray === false && !records.length) {
            records = null;
          } else {
            if (!error && records.length) {
              records = _this["export"](records);
            }
          }
        }
        result = records;
        if (Tower.isClient) {
          _this.clear();
        }
        if (_.isArray(records)) {
          Ember.setProperties(_this, {
            hasFirstPage: !!records.length,
            hasPreviousPage: !!records.length,
            hasNextPage: !!records.length,
            hasLastPage: !!records.length
          });
          _this.addObjects(records);
        }
        if (callback) {
          callback.call(_this, error, records);
        }
        return records;
      });
    }
    if (returnArray === false) {
      return result;
    } else {
      return this;
    }
  },
  _count: function(callback) {
    var _this = this;
    return this.store.count(this, function(error, count) {
      Ember.set(_this, 'totalCount', count);
      if (callback) {
        return callback.apply(_this, arguments);
      }
    });
  },
  _exists: function(callback) {
    var _this = this;
    return this.store.exists(this, function(error, exists) {
      Ember.set(_this, 'isEmpty', !exists);
      if (callback) {
        return callback.apply(_this, arguments);
      }
    });
  },
  _hasContent: function(callback) {
    var records;
    if (Tower.isClient && this._invalidated) {
      delete this._invalidated;
      if (callback) {
        callback.call(this);
      }
      return false;
    }
    records = Ember.get(this, 'content');
    if (records && records.length) {
      if (callback) {
        callback.call(this, null, records);
      }
      return true;
    } else {
      return false;
    }
  }
};

_ref = ['Before', 'After'];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  phase = _ref[_i];
  _ref1 = ['Insert', 'Update', 'Destroy', 'Find'];
  _fn = function(phase, action) {
    return Tower.ModelCursorFinders["_run" + phase + action + "CallbacksOnStore"] = function(done, records) {
      return this.store["run" + phase + action](this, done, records);
    };
  };
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    action = _ref1[_j];
    _fn(phase, action);
  }
}

Tower.ModelCursorFinders = Ember.Mixin.create(Tower.ModelCursorFinders);

module.exports = Tower.ModelCursorFinders;
