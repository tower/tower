(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Tower.Model.Relation.BelongsTo = (function(_super) {

    __extends(BelongsTo, _super);

    function BelongsTo(owner, name, options) {
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
      owner.prototype[name] = function() {
        return this.relation(name);
      };
      owner.prototype["build" + (Tower.Support.String.camelize(name))] = function(attributes, callback) {
        return this.buildRelation(name, attributes, callback);
      };
      owner.prototype["create" + (Tower.Support.String.camelize(name))] = function(attributes, callback) {
        return this.createRelation(name, attributes, callback);
      };
    }

    BelongsTo.Criteria = (function(_super2) {

      __extends(Criteria, _super2);

      function Criteria() {
        Criteria.__super__.constructor.apply(this, arguments);
      }

      Criteria.prototype.isBelongsTo = true;

      Criteria.prototype.toCriteria = function() {
        var criteria, relation;
        criteria = Criteria.__super__.toCriteria.apply(this, arguments);
        relation = this.relation;
        criteria.where({
          id: {
            $in: [this.owner.get(relation.foreignKey)]
          }
        });
        return criteria;
      };

      return Criteria;

    })(Tower.Model.Relation.Criteria);

    return BelongsTo;

  })(Tower.Model.Relation);

  module.exports = Tower.Model.Relation.BelongsTo;

}).call(this);
