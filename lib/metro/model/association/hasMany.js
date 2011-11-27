(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Model.Association.HasMany = (function() {

    __extends(HasMany, Metro.Model.Association);

    function HasMany(owner, name, options) {
      if (options == null) options = {};
      HasMany.__super__.constructor.call(this, owner, name, options);
      this.foreignKey = options.foreignKey || Metro.Support.String.camelize("" + owner.name + "Id", true);
    }

    return HasMany;

  })();

  module.exports = Metro.Model.Association.HasMany;

}).call(this);
