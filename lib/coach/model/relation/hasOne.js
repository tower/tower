(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Coach.Model.Relation.HasOne = (function() {

    __extends(HasOne, Coach.Model.Relation);

    function HasOne() {
      HasOne.__super__.constructor.apply(this, arguments);
    }

    return HasOne;

  })();

  module.exports = Coach.Model.Relation.HasOne;

}).call(this);
