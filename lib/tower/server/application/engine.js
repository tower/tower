var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Engine = (function() {

  __extends(Engine, Tower.Class);

  function Engine() {
    Engine.__super__.constructor.apply(this, arguments);
  }

  Engine.include(Tower.Support.Callbacks);

  return Engine;

})();
