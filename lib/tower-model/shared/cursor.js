var _,
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

_ = Tower._;

Tower.ModelCursor = (function(_super) {
  var ModelCursor;

  function ModelCursor() {
    return ModelCursor.__super__.constructor.apply(this, arguments);
  }

  ModelCursor = __extends(ModelCursor, _super);

  ModelCursor.reopenClass({
    make: function() {
      var cursor;
      cursor = this.create();
      cursor.set('content', Ember.A([]));
      return cursor;
    }
  });

  ModelCursor.reopen({
    defaultLimit: 20,
    isCursor: true
  });

  return ModelCursor;

})(Tower.Collection);

Tower.ModelCursor.toString = function() {
  return 'Tower.ModelCursor';
};

Tower.ModelCursor.prototype.defaultLimit = 20;

require('./cursor/finders');

require('./cursor/operations');

require('./cursor/persistence');

require('./cursor/serialization');

Tower.ModelCursorMixin = Ember.Mixin.create(Tower.ModelCursorFinders, Tower.ModelCursorOperations, Tower.ModelCursorPersistence, Tower.ModelCursorSerialization);

Tower.ModelCursor.reopen(Tower.ModelCursorMixin);

module.exports = Tower.ModelCursor;
