var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Relation = (function() {

  __extends(Relation, Tower.Class);

  function Relation(owner, name, options, callback) {
    var key, value;
    if (options == null) options = {};
    for (key in options) {
      value = options[key];
      this[key] = value;
    }
    this.owner = owner;
    this.name = name;
    this.targetClassName = this.type = Tower.namespaced(options.type || options.className || Tower.Support.String.camelize(Tower.Support.String.singularize(name)));
    this.dependent || (this.dependent = false);
    this.counterCache || (this.counterCache = false);
    if (!this.hasOwnProperty("cache")) this.cache = false;
    if (!this.hasOwnProperty("readOnly")) this.readOnly = false;
    if (!this.hasOwnProperty("validate")) this.validate = false;
    if (!this.hasOwnProperty("autoSave")) this.autoSave = false;
    if (!this.hasOwnProperty("touch")) this.touch = false;
    this.inverseOf || (this.inverseOf = void 0);
    if (!this.hasOwnProperty("polymorphic")) this.polymorphic = false;
    if (!this.hasOwnProperty("default")) this["default"] = false;
  }

  Relation.prototype.scoped = function(record) {
    return new this.constructor.Scope({
      model: Tower.constant(this.targetClassName),
      owner: record,
      relation: this
    });
  };

  Relation.Scope = (function() {

    __extends(Scope, Tower.Model.Scope);

    Scope.prototype.constructable = function() {
      return !!!this.relation.polymorphic;
    };

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

require('./relation/hasManyThrough');

require('./relation/hasOne');

require('./relation/hasOneThrough');

module.exports = Tower.Model.Relation;
