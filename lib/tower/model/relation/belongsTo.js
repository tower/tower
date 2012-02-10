var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Relation.BelongsTo = (function() {

  __extends(BelongsTo, Tower.Model.Relation);

  function BelongsTo(owner, name, options) {
    var self;
    if (options == null) options = {};
    BelongsTo.__super__.constructor.call(this, owner, name, options);
    this.foreignKey = "" + name + "Id";
    owner.field(this.foreignKey, {
      type: "Id"
    });
    if (this.polymorphic) {
      this.foreignType = "" + name + "Type";
      owner.field(this.foreignType, {
        type: "String"
      });
    }
    owner.prototype[name] = function(callback) {
      return this.relation(name).first(callback);
    };
    self = this;
    owner.prototype["build" + (Tower.Support.String.camelize(name))] = function(attributes, callback) {
      return this.buildRelation(name, attributes, callback);
    };
    owner.prototype["create" + (Tower.Support.String.camelize(name))] = function(attributes, callback) {
      return this.createRelation(name, attributes, callback);
    };
  }

  BelongsTo.Scope = (function() {

    __extends(Scope, BelongsTo.Scope);

    function Scope() {
      Scope.__super__.constructor.apply(this, arguments);
    }

    Scope.prototype.create = function() {
      return console.log("CREATE!");
    };

    return Scope;

  })();

  return BelongsTo;

})();

module.exports = Tower.Model.Relation.BelongsTo;
