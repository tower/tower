var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Relation.HasOne = (function(_super) {

  __extends(HasOne, _super);

  HasOne.name = 'HasOne';

  function HasOne() {
    return HasOne.__super__.constructor.apply(this, arguments);
  }

  return HasOne;

})(Tower.Model.Relation);

Tower.Model.Relation.HasOne.Criteria = (function(_super) {

  __extends(Criteria, _super);

  Criteria.name = 'Criteria';

  function Criteria() {
    return Criteria.__super__.constructor.apply(this, arguments);
  }

  Criteria.prototype.isHasOne = true;

  return Criteria;

})(Tower.Model.Relation.Criteria);

module.exports = Tower.Model.Relation.HasOne;
