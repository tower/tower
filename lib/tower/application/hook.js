var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Hook = (function(_super) {

  __extends(Hook, _super);

  Hook.name = 'Hook';

  function Hook() {
    return Hook.__super__.constructor.apply(this, arguments);
  }

  Hook.include(Tower.Support.Callbacks);

  return Hook;

})(Tower.Class);

module.exports = Tower.Hook;
