(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Coach.Model.Validator.Presence = (function() {

    __extends(Presence, Coach.Model.Validator);

    function Presence() {
      Presence.__super__.constructor.apply(this, arguments);
    }

    Presence.prototype.validate = function(record, attribute, errors) {
      if (!Coach.Support.Object.isPresent(record[attribute])) {
        errors[attribute] || (errors[attribute] = []);
        errors[attribute].push(Coach.t("model.errors.presence", {
          attribute: attribute
        }));
        return false;
      }
      return true;
    };

    return Presence;

  })();

  module.exports = Coach.Model.Validator.Presence;

}).call(this);
