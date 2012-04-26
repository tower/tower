var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Application.Configuration = (function(_super) {

  __extends(Configuration, _super);

  Configuration.name = 'Configuration';

  function Configuration() {
    return Configuration.__super__.constructor.apply(this, arguments);
  }

  Configuration.include(Tower.Support.Callbacks);

  return Configuration;

})(Tower.Class);

module.exports = Tower.Application.Configuration;
