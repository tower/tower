var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Store.CouchDB = (function(_super) {

  __extends(CouchDB, _super);

  CouchDB.name = 'CouchDB';

  function CouchDB() {
    return CouchDB.__super__.constructor.apply(this, arguments);
  }

  return CouchDB;

})(Tower.Store);

module.exports = Tower.Store.CouchDB;
