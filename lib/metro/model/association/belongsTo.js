(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Model.Association.BelongsTo = (function() {

    __extends(BelongsTo, Metro.Model.Association);

    function BelongsTo(owner, name, options) {
      if (options == null) options = {};
      BelongsTo.__super__.constructor.call(this, owner, name, options);
      this.foreignKey = options.foreignKey || Metro.Support.String.camelize("" + (Metro.Support.String.singularize(name)) + "Id", true);
    }

    return BelongsTo;

  })();

  module.exports = Metro.Model.Association.BelongsTo;

}).call(this);
