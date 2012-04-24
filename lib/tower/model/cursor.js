var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend(child);
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Model.Cursor = (function(_super) {
  var Cursor;

  function Cursor() {
    return Cursor.__super__.constructor.apply(this, arguments);
  }

  Cursor = __extends(Cursor, _super);

  __defineProperty(Cursor,  "defaultLimit", 20);

  __defineProperty(Cursor,  "init", function(options) {
    if (options == null) {
      options = {};
    }
    return this.initialize(options);
  });

  __defineProperty(Cursor,  "pushMatching", function(records) {
    var matching;
    matching = Tower.Store.Operators.select(records, this.conditions());
    this.pushObjects(matching);
    return matching;
  });

  __defineProperty(Cursor,  "pullMatching", function(records) {
    var matching;
    matching = Tower.Store.Operators.select(records, this.conditions());
    this.pullObjects(matching);
    return matching;
  });

  return Cursor;

})(Tower.Collection);

require('./cursor/finders');

require('./cursor/operations');

require('./cursor/persistence');

require('./cursor/serialization');

Tower.Model.Cursor.include(Tower.Model.Cursor.Finders);

Tower.Model.Cursor.include(Tower.Model.Cursor.Operations);

Tower.Model.Cursor.include(Tower.Model.Cursor.Persistence);

Tower.Model.Cursor.include(Tower.Model.Cursor.Serialization);

module.exports = Tower.Model.Cursor;
