var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Engine = (function(_super) {

  __extends(Engine, _super);

  Engine.name = 'Engine';

  function Engine() {
    return Engine.__super__.constructor.apply(this, arguments);
  }

  return Engine;

})(Tower.Hook);

module.exports = Tower.Engine;
