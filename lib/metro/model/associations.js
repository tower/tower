(function() {
  var Associations;
  Associations = (function() {
    function Associations() {}
    Associations.hasOne = function(name, options) {
      if (options == null) {
        options = {};
      }
    };
    Associations.hasMany = function(name, options) {
      var association;
      if (options == null) {
        options = {};
      }
      options.foreignKey = "" + (Metro.Support.String.underscore(this.name)) + "Id";
      this.associations()[name] = association = new Metro.Model.Association(this.name, name, options);
      Object.defineProperty(this.prototype, name, {
        enumerable: true,
        configurable: true,
        get: function() {
          return this._getAssociationScope(name);
        },
        set: function(value) {
          return this._setAssociationScope(name, value);
        }
      });
      return association;
    };
    Associations.belongsTo = function(name, options) {
      var association;
      if (options == null) {
        options = {};
      }
      this.associations()[name] = association = new Metro.Model.Association(this.name, name, options);
      Object.defineProperty(this.prototype, name, {
        enumerable: true,
        configurable: true,
        get: function() {
          return this._getBelongsToAssocation(name);
        },
        set: function(value) {
          return this._setBelongsToAssocation(name, value);
        }
      });
      Object.defineProperty(this.prototype, "" + name + "Id", {
        enumerable: true,
        configurable: true,
        get: function() {
          return this._getBelongsToAssocationId("" + name + "Id");
        },
        set: function(value) {
          return this._setBelongsToAssocationId("" + name + "Id", value);
        }
      });
      return association;
    };
    Associations.associations = function() {
      var _ref;
      return (_ref = this._associations) != null ? _ref : this._associations = {};
    };
    Associations.prototype._getAssociationScope = function(name) {
      return this.constructor.associations()[name].scoped(this.id);
    };
    Associations.prototype._setAssociationScope = function(name, value) {
      return this.constructor.associations()[name].scoped(this.id).destroyAll();
    };
    Associations.prototype._getBelongsToAssocationId = function(name) {
      return this.attributes[name];
    };
    Associations.prototype._setBelongsToAssocationId = function(name, value) {
      return this.attributes[name] = value;
    };
    Associations.prototype._getBelongsToAssocation = function(name) {
      var id;
      id = this._getBelongsToAssocationId(name);
      if (!id) {
        return null;
      }
      return global[this.associations()[name].targetClassName].where({
        id: this.id
      }).first();
    };
    Associations.prototype._setBelongsToAssocation = function(name, value) {
      var id;
      id = this._getBelongsToAssocationId(name);
      if (!id) {
        return null;
      }
      return global[this.associations()[name].targetClassName].where({
        id: this.id
      }).first();
    };
    return Associations;
  })();
  module.exports = Associations;
}).call(this);
