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

Tower.ModelRelationBelongsTo = (function(_super) {
  var ModelRelationBelongsTo;

  function ModelRelationBelongsTo() {
    return ModelRelationBelongsTo.__super__.constructor.apply(this, arguments);
  }

  ModelRelationBelongsTo = __extends(ModelRelationBelongsTo, _super);

  ModelRelationBelongsTo.reopen({
    isBelongsTo: true,
    init: function(owner, name, options) {
      var computed, mixins;
      if (options == null) {
        options = {};
      }
      this._super.apply(this, arguments);
      this.foreignKey = "" + name + "Id";
      owner.field(this.foreignKey, {
        type: "Id"
      });
      mixins = owner.PrototypeMixin.mixins;
      computed = mixins[mixins.length - 1].properties[this.foreignKey];
      computed._dependentKeys.push(this.name);
      if (this.polymorphic) {
        this.foreignType = "" + name + "Type";
        return owner.field(this.foreignType, {
          type: 'String'
        });
      }
    }
  });

  return ModelRelationBelongsTo;

})(Tower.ModelRelation);

Tower.ModelRelationBelongsToCursorMixin = Ember.Mixin.create({
  isBelongsTo: true,
  clonePrototype: function() {
    var clone;
    clone = this.concat();
    clone.isCursor = true;
    Tower.ModelRelationCursorMixin.apply(clone);
    return Tower.ModelRelationBelongsToCursorMixin.apply(clone);
  },
  find: function() {
    this.compile();
    return this._super.apply(this, arguments);
  },
  compile: function() {
    var relation;
    relation = this.relation;
    return this.where({
      id: {
        $in: [this.owner.get(relation.foreignKey)]
      }
    });
  }
});

Tower.ModelRelationBelongsToCursor = (function(_super) {
  var ModelRelationBelongsToCursor;

  function ModelRelationBelongsToCursor() {
    return ModelRelationBelongsToCursor.__super__.constructor.apply(this, arguments);
  }

  ModelRelationBelongsToCursor = __extends(ModelRelationBelongsToCursor, _super);

  ModelRelationBelongsToCursor.reopenClass({
    makeOld: function() {
      var array;
      array = [];
      array.isCursor = true;
      Tower.ModelRelationCursorMixin.apply(array);
      return Tower.ModelRelationBelongsToCursorMixin.apply(array);
    }
  });

  ModelRelationBelongsToCursor.include(Tower.ModelRelationBelongsToCursorMixin);

  return ModelRelationBelongsToCursor;

})(Tower.ModelRelationCursor);

module.exports = Tower.ModelRelationBelongsTo;
