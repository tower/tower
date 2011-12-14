(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Model.Relation.HasMany = (function() {

    __extends(HasMany, Metro.Model.Relation);

    function HasMany(owner, name, options) {
      if (options == null) options = {};
      HasMany.__super__.constructor.call(this, owner, name, options);
      if (Metro.accessors) {
        Metro.Support.Object.defineProperty(owner.prototype, name, {
          enumerable: true,
          configurable: true,
          get: function() {
            return this.relation(name);
          },
          set: function(value) {
            return this.relation(name).set(value);
          }
        });
      }
      this.foreignKey = options.foreignKey || Metro.Support.String.camelize("" + owner.name + "Id", true);
      if (!this.hasOwnProperty("cache")) this.cache = false;
      if (this.cache) {
        if (typeof this.cache === "string") {
          this.cache = true;
          this.cacheKey = this.cacheKey;
        } else {
          this.cacheKey = Metro.Support.String.singularize(name) + "Ids";
        }
        this.owner.key(this.cacheKey, {
          type: "array",
          "default": []
        });
      }
    }

    HasMany.Scope = (function() {

      __extends(Scope, HasMany.Scope);

      function Scope(options) {
        var defaults;
        if (options == null) options = {};
        Scope.__super__.constructor.apply(this, arguments);
        if (this.foreignKey && this.owner.id !== void 0) {
          defaults = {};
          defaults[this.foreignKey] = this.owner.id;
          this.where(defaults);
        }
      }

      Scope.prototype.create = function(attributes, callback) {
        var relation, self;
        self = this;
        relation = this.relation;
        return this.store().create(Metro.Support.Object.extend(this.criteria.query, attributes), this.criteria.options, function(error, record) {
          var updates;
          if (!error) {
            if (relation && relation.cache) {
              updates = {};
              updates[relation.cacheKey] = record.id;
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

  module.exports = Metro.Model.Relation.HasMany;

}).call(this);
