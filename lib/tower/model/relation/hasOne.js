var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Relation.HasOne = (function(_super) {

  __extends(HasOne, _super);

  function HasOne() {
    HasOne.__super__.constructor.apply(this, arguments);
  }

  HasOne.Scope = (function(_super2) {

    __extends(Scope, _super2);

    function Scope() {
      Scope.__super__.constructor.apply(this, arguments);
    }

    Scope.prototype.isHasOne = true;

    return Scope;

  })(HasOne.Scope);

  return HasOne;

})(Tower.Model.Relation);

module.exports = Tower.Model.Relation.HasOne;
