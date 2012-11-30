var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
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

Tower.StoreLocalStorage = (function(_super) {
  var StoreLocalStorage;

  function StoreLocalStorage() {
    return StoreLocalStorage.__super__.constructor.apply(this, arguments);
  }

  StoreLocalStorage = __extends(StoreLocalStorage, _super);

  __defineProperty(StoreLocalStorage,  "initialize", function() {
    return this.lastId = 0;
  });

  __defineProperty(StoreLocalStorage,  "_setRecord", function(record) {});

  __defineProperty(StoreLocalStorage,  "_getRecord", function(key) {
    return this;
  });

  __defineProperty(StoreLocalStorage,  "_removeRecord", function(key) {
    return delete this.records[record.id];
  });

  return StoreLocalStorage;

})(Tower.StoreMemory);

module.exports = Tower.StoreLocalStorage;
