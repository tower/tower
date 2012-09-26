var _,
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

_ = Tower._;

Tower.ModelRelationHasOne = (function(_super) {
  var ModelRelationHasOne;

  function ModelRelationHasOne() {
    return ModelRelationHasOne.__super__.constructor.apply(this, arguments);
  }

  ModelRelationHasOne = __extends(ModelRelationHasOne, _super);

  ModelRelationHasOne.reopen({
    isHasOne: true
  });

  return ModelRelationHasOne;

})(Tower.ModelRelation);

Tower.ModelRelationHasOneCursorMixin = Ember.Mixin.create({
  isHasOne: true,
  clonePrototype: function() {
    var clone;
    clone = this.concat();
    clone.isCursor = true;
    Tower.ModelRelationCursorMixin.apply(clone);
    return Tower.ModelRelationHasOneCursorMixin.apply(clone);
  },
  insert: function(callback) {
    var result,
      _this = this;
    this.compile();
    result = void 0;
    this._insert(function(error, record) {
      result = record;
      if (!error && record) {
        _this.owner.set(_this.relation.name, record);
      }
      if (callback) {
        return callback.call(_this, error, record);
      }
    });
    return result;
  },
  find: function(callback) {
    var result,
      _this = this;
    result = void 0;
    this._find(function(error, record) {
      result = record;
      if (!error && record) {
        _this.owner.set(_this.relation.name, record);
      }
      if (callback) {
        return callback.call(_this, error, record);
      }
    });
    return result;
  },
  compile: function() {
    var data, id, owner, relation, _name;
    owner = this.owner;
    relation = this.relation;
    id = owner.get('id');
    data = {};
    if (relation.foreignKey) {
      if (id !== void 0) {
        data[relation.foreignKey] = id;
      }
      if (relation.foreignType) {
        data[_name = relation.foreignType] || (data[_name] = owner.constructor.className());
      }
    }
    return this.where(data);
  }
});

Tower.ModelRelationHasOneCursor = (function(_super) {
  var ModelRelationHasOneCursor;

  function ModelRelationHasOneCursor() {
    return ModelRelationHasOneCursor.__super__.constructor.apply(this, arguments);
  }

  ModelRelationHasOneCursor = __extends(ModelRelationHasOneCursor, _super);

  ModelRelationHasOneCursor.reopenClass({
    makeOld: function() {
      var array;
      array = [];
      array.isCursor = true;
      Tower.ModelRelationCursorMixin.apply(array);
      return Tower.ModelRelationHasOneCursorMixin.apply(array);
    }
  });

  ModelRelationHasOneCursor.include(Tower.ModelRelationHasOneCursorMixin);

  return ModelRelationHasOneCursor;

})(Tower.ModelRelationCursor);

module.exports = Tower.ModelRelationHasOne;
