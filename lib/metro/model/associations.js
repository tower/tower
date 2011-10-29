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
      var reflection;
      if (options == null) {
        options = {};
      }
      options.foreignKey = "" + (Metro.Support.String.underscore(this.name)) + "Id";
      this.reflections()[name] = reflection = new Metro.Model.Reflection("hasMany", this.name, name, options);
      Object.defineProperty(this.prototype, name, {
        enumerable: true,
        configurable: true,
        get: function() {
          return this._getHasManyAssociation(name);
        },
        set: function(value) {
          return this._setHasManyAssociation(name, value);
        }
      });
      return reflection;
    };
    Associations.belongsTo = function(name, options) {
      var reflection;
      if (options == null) {
        options = {};
      }
      this.reflections()[name] = reflection = new Metro.Model.Association("belongsTo", this.name, name, options);
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
      this.keys()["" + name + "Id"] = new Metro.Model.Attribute("" + name + "Id", options);
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
      return reflection;
    };
    Associations.reflections = function() {
      var _ref;
      return (_ref = this._reflections) != null ? _ref : this._reflections = {};
    };
    Associations.prototype._getHasManyAssociation = function(name) {
      return this.constructor.reflections()[name].association(this.id);
    };
    Associations.prototype._setHasManyAssociation = function(name, value) {
      return this.constructor.reflections()[name].association(this.id).destroyAll();
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
      return global[this.reflections()[name].targetClassName].where({
        id: this.id
      }).first();
    };
    Associations.prototype._setBelongsToAssocation = function(name, value) {
      var id;
      id = this._getBelongsToAssocationId(name);
      if (!id) {
        return null;
      }
      return global[this.reflections()[name].targetClassName].where({
        id: this.id
      }).first();
    };
    return Associations;
  })();
  module.exports = Associations;
}).call(this);
