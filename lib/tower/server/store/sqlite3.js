var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Store.SQLite3 = (function(_super) {

  __extends(SQLite3, _super);

  SQLite3.name = 'SQLite3';

  function SQLite3() {
    return SQLite3.__super__.constructor.apply(this, arguments);
  }

  return SQLite3;

})(Tower.Store);

module.exports = Tower.Store.SQLite3;
