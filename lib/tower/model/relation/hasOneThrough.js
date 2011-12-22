(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Tower.Model.Relation.HasOneThrough = (function() {

    __extends(HasOneThrough, Tower.Model.Relation.HasOne);

    function HasOneThrough() {
      HasOneThrough.__super__.constructor.apply(this, arguments);
    }

    return HasOneThrough;

  })();

  module.exports = Tower.Model.Relation.HasOneThrough;

}).call(this);
