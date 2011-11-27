
  Metro.Model.Associations = {
    ClassMethods: {
      associations: function() {
        return this._associations || (this._associations = {});
      },
      association: function(name) {
        var association;
        association = this.associations()[name];
        if (!association) {
          throw new Error("Reflection for '" + name + "' does not exist on '" + this.name + "'");
        }
        return association;
      },
      hasOne: function(name, options) {
        if (options == null) options = {};
      },
      hasMany: function(name, options) {
        if (options == null) options = {};
        return this.associations()[name] = new Metro.Model.Association.HasMany(this, name, options);
      },
      belongsTo: function(name, options) {
        var association;
        if (options == null) options = {};
        this.associations()[name] = association = new Metro.Model.Association.BelongsTo(this, name, options);
        this.key("" + name + "Id");
        return association;
      }
    },
    InstanceMethods: {
      association: function(name) {
        var _base;
        return (_base = this.associations)[name] || (_base[name] = this.constructor.association(name).scoped(this));
      }
    }
  };

  module.exports = Metro.Model.Associations;
