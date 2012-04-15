var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Store.PostgreSQL = (function(_super) {

  __extends(PostgreSQL, _super);

  PostgreSQL.name = 'PostgreSQL';

  function PostgreSQL() {
    return PostgreSQL.__super__.constructor.apply(this, arguments);
  }

  return PostgreSQL;

})(Tower.Store);

module.exports = Tower.Store.PostgreSQL;
