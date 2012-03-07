var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Hook = (function() {

  __extends(Hook, Tower.Class);

  function Hook() {
    Hook.__super__.constructor.apply(this, arguments);
  }

  Hook.include(Tower.Support.Callbacks);

  return Hook;

})();

module.exports = Tower.Hook;
