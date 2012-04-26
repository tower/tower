var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Store.Local = (function(_super) {

  __extends(Local, _super);

  Local.name = 'Local';

  function Local() {
    return Local.__super__.constructor.apply(this, arguments);
  }

  Local.prototype.initialize = function() {
    return this.lastId = 0;
  };

  Local.prototype._setRecord = function(record) {};

  Local.prototype._getRecord = function(key) {
    return this;
  };

  Local.prototype._removeRecord = function(key) {
    return delete this.records[record.id];
  };

  return Local;

})(Tower.Store.Memory);

module.exports = Tower.Store.Local;
