(function() {
  var RecordNotUnique;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Model.Errors = {
    ClassMethods: {
      RecordNotUnique: RecordNotUnique = (function() {

        __extends(RecordNotUnique, Error);

        function RecordNotUnique() {
          RecordNotUnique.__super__.constructor.apply(this, arguments);
        }

        return RecordNotUnique;

      })()
    }
  };

}).call(this);
