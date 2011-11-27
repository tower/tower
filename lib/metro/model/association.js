(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Model.Association = (function() {

    __extends(Association, Metro.Object);

    function Association(owner, name, options) {
      if (options == null) options = {};
      if (Metro.accessors) {
        Metro.Support.Object.defineProperty(owner.prototype, name, {
          enumerable: true,
          configurable: true,
          get: function() {
            return this.association(name);
          },
          set: function(value) {
            return this.association(name).set(value);
          }
        });
      }
      this.owner = owner;
      this.name = name;
      this.targetClassName = Metro.namespaced(options.className || Metro.Support.String.camelize(name));
    }

    Association.prototype.scoped = function(record) {
      return (new Metro.Model.Scope(this.targetClassName)).where(this.conditions(record));
    };

    Association.prototype.conditions = function(record) {
      var result;
      result = {};
      if (this.foreignKey && record.id) result[this.foreignKey] = record.id;
      return result;
    };

    Association.delegate("where", "find", "all", "first", "last", "store", {
      to: "scoped"
    });

    return Association;

  })();

  require('./association/belongsTo');

  require('./association/hasMany');

  require('./association/hasOne');

  module.exports = Metro.Model.Association;

}).call(this);
