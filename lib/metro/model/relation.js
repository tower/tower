(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Model.Relation = (function() {

    __extends(Relation, Metro.Object);

    function Relation(owner, name, options) {
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

    Relation.prototype.scoped = function(record) {
      return new this.constructor.Scope({
        model: Metro.constant(this.targetClassName),
        owner: record,
        relation: this
      });
    };

    Relation.Scope = (function() {

      __extends(Scope, Metro.Model.Scope);

      function Scope(options) {
        if (options == null) options = {};
        Scope.__super__.constructor.apply(this, arguments);
        this.owner = options.owner;
        this.relation = options.relation;
        this.foreignKey = this.relation.foreignKey;
      }

      return Scope;

    })();

    return Relation;

  })();

  require('./relation/belongsTo');

  require('./relation/hasMany');

  require('./relation/hasOne');

  module.exports = Metro.Model.Relation;

}).call(this);
