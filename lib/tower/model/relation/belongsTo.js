var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend(child);
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Model.Relation.BelongsTo = (function(_super) {
  var BelongsTo;

  function BelongsTo() {
    return BelongsTo.__super__.constructor.apply(this, arguments);
  }

  BelongsTo = __extends(BelongsTo, _super);

  __defineProperty(BelongsTo,  "init", function(owner, name, options) {
    if (options == null) {
      options = {};
    }
    this._super.apply(this, arguments);
    this.foreignKey = "" + name + "Id";
    owner.field(this.foreignKey, {
      type: "Id"
    });
    if (this.polymorphic) {
      this.foreignType = "" + name + "Type";
      owner.field(this.foreignType, {
        type: 'String'
      });
    }
    return owner.prototype[name] = function() {
      return this.relation(name);
    };
  });

  return BelongsTo;

})(Tower.Model.Relation);

Tower.Model.Relation.BelongsTo.Cursor = (function(_super) {
  var Cursor;

  function Cursor() {
    return Cursor.__super__.constructor.apply(this, arguments);
  }

  Cursor = __extends(Cursor, _super);

  __defineProperty(Cursor,  "isBelongsTo", true);

  __defineProperty(Cursor,  "toCursor", function() {
    var cursor, relation;
    cursor = Cursor.__super__[ "toCursor"].apply(this, arguments);
    relation = this.relation;
    cursor.where({
      id: {
        $in: [this.owner.get(relation.foreignKey)]
      }
    });
    return cursor;
  });

  return Cursor;

})(Tower.Model.Relation.Cursor);

module.exports = Tower.Model.Relation.BelongsTo;
