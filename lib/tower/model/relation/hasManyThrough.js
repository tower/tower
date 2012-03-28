var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Relation.HasManyThrough = (function(_super) {

  __extends(HasManyThrough, _super);

  function HasManyThrough() {
    HasManyThrough.__super__.constructor.apply(this, arguments);
  }

  HasManyThrough.Scope = (function(_super2) {

    __extends(Scope, _super2);

    function Scope() {
      Scope.__super__.constructor.apply(this, arguments);
    }

    Scope.prototype.toCriteria = function() {
      var criteria, relation;
      criteria = Scope.__super__.toCriteria.apply(this, arguments);
      return relation = this.relation;
    };

    return Scope;

  })(HasManyThrough.Scope);

  return HasManyThrough;

})(Tower.Model.Relation.HasMany);
