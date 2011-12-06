(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Object = (function() {

    __extends(Object, Metro.Class);

    function Object() {
      Object.__super__.constructor.apply(this, arguments);
    }

    Object.extend(Metro.Support.EventEmitter);

    Object.include(Metro.Support.EventEmitter);

    return Object;

  })();

  module.exports = Metro.Object;

}).call(this);
