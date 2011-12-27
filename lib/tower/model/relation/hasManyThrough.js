var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Relation.HasManyThrough = (function() {

  __extends(HasManyThrough, Tower.Model.Relation.HasMany);

  /*
    * HasManyThrough Relation
    * 
    * Examples
    * 
    *     @hasMany "comments", through: "articles"
    *
  */

  function HasManyThrough(owner, name, options) {
    if (options == null) options = {};
    HasManyThrough.__super__.constructor.call(this, owner, name, options);
  }

  HasManyThrough.Scope = (function() {

    __extends(Scope, HasManyThrough.Scope);

    function Scope(options) {
      if (options == null) options = {};
      Scope.__super__.constructor.call(this, options);
    }

    return Scope;

  })();

  return HasManyThrough;

})();

module.exports = Tower.Model.Relation.HasManyThrough;
