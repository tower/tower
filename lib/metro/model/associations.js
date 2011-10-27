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
      this.associations()[name] = association = new Association(this.className, name, options);
      Object.defineProperty(this.prototype, name, {
        enumerable: true,
        configurable: true
      }, {
        get: function() {
          return this._getAssociationScope(name);
        },
        set: function(value) {
          return this._setAssociationScope(name, value);
        }
      });
      return association;
    };
    Associations.belongsTo = function() {};
    Associations.associations = function() {
      var _ref;
      return (_ref = this._associations) != null ? _ref : this._associations = {};
    };
    Associations.prototype._getAssociationScope = function(name) {
      return this.constructor.associations()[name].scoped();
    };
    Associations.prototype._setAssociationScope = function(name, value) {
      return this.constructor.associations()[name].scoped().destroyAll();
    };
    return Associations;
  })();
  module.exports = Associations;
}).call(this);
