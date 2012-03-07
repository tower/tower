var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Application.Configuration = (function() {

  __extends(Configuration, Tower.Class);

  function Configuration() {
    Configuration.__super__.constructor.apply(this, arguments);
  }

  Configuration.include(Tower.Support.Callbacks);

  return Configuration;

})();

module.exports = Tower.Application.Configuration;
