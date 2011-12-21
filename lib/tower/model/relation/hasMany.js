(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Tower.Model.Relation.HasMany = (function() {

    __extends(HasMany, Tower.Model.Relation);

    function HasMany(owner, name, options) {
      if (options == null) options = {};
      HasMany.__super__.constructor.call(this, owner, name, options);
      owner.prototype[name] = function() {
        return this.relation(name);
      };
      this.foreignKey = options.foreignKey || Tower.Support.String.camelize("" + owner.name + "Id", true);
      if (this.cache) {
        if (typeof this.cache === "string") {
          this.cache = true;
          this.cacheKey = this.cacheKey;
        } else {
          this.cacheKey = Tower.Support.String.singularize(name) + "Ids";
        }
        this.owner.field(this.cacheKey, {
          type: "Array",
          "default": []
        });
      }
    }

    HasMany.Scope = (function() {

      __extends(Scope, HasMany.Scope);

      function Scope(options) {
        var defaults, id;
        if (options == null) options = {};
        Scope.__super__.constructor.apply(this, arguments);
        id = this.owner.get("id");
        if (this.foreignKey && id !== void 0) {
          defaults = {};
          defaults[this.foreignKey] = id;
          this.where(defaults);
        }
      }

      Scope.prototype.create = function(attributes, callback) {
        var relation, self;
        self = this;
        relation = this.relation;
        return this.store().create(Tower.Support.Object.extend(this.criteria.query, attributes), this.criteria.options, function(error, record) {
          var updates;
          if (!error) {
            if (relation && relation.cache) {
              updates = {};
              updates[relation.cacheKey] = record.get("id");
              return self.owner.updateAttributes({
                "$push": updates
              }, callback);
            } else {
              if (callback) return callback.call(this, error, record);
            }
          } else {
            if (callback) return callback.call(this, error, record);
          }
        });
      };

      return Scope;

    })();

    return HasMany;

  })();

  module.exports = Tower.Model.Relation.HasMany;

}).call(this);
