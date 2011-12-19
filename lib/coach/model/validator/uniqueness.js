(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Coach.Model.Validator.Uniqueness = (function() {

    __extends(Uniqueness, Coach.Model.Validator);

    function Uniqueness() {
      Uniqueness.__super__.constructor.apply(this, arguments);
    }

    Uniqueness.prototype.validate = function(record, attribute, errors) {
      return true;
    };

    return Uniqueness;

  })();

  module.exports = Coach.Model.Validator.Uniqueness;

}).call(this);
