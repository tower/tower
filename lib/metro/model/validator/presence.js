(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Model.Validator.Presence = (function() {

    __extends(Presence, Metro.Model.Validator);

    function Presence() {
      Presence.__super__.constructor.apply(this, arguments);
    }

    Presence.prototype.validate = function(record, attribute, errors) {
      if (!Metro.Support.Object.isPresent(record[attribute])) {
        errors.push({
          attribute: attribute,
          message: Metro.t("model.errors.presence", {
            attribute: attribute
          })
        });
        return false;
      }
      return true;
    };

    return Presence;

  })();

  module.exports = Metro.Model.Validator.Presence;

}).call(this);
