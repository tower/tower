(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Model.Association = (function() {

    __extends(Association, Metro.Object);

    function Association(owner, name, options) {
      var key, value;
      if (options == null) options = {};
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
      this.owner = owner;
      this.name = name;
      this.targetClassName = Metro.namespaced(options.className || Metro.Support.String.camelize(name));
    }

    Association.prototype.scoped = function(record) {
      return new this.constructor.Scope(this.targetClassName, record, this);
    };

    Association.Scope = (function() {

      __extends(Scope, Metro.Model.Scope);

      function Scope(sourceClassName, owner, association) {
        Scope.__super__.constructor.apply(this, arguments);
        this.owner = owner;
        this.association = association;
        this.foreignKey = association.foreignKey;
      }

      return Scope;

    })();

    return Association;

  })();

  require('./association/belongsTo');

  require('./association/hasMany');

  require('./association/hasOne');

  module.exports = Metro.Model.Association;

}).call(this);
