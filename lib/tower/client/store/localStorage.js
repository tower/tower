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

Tower.Store.LocalStorage = (function(_super) {
  var LocalStorage;

  function LocalStorage() {
    return LocalStorage.__super__.constructor.apply(this, arguments);
  }

  LocalStorage = __extends(LocalStorage, _super);

  __defineProperty(LocalStorage,  "initialize", function() {
    return this.lastId = 0;
  });

  __defineProperty(LocalStorage,  "_setRecord", function(record) {});

  __defineProperty(LocalStorage,  "_getRecord", function(key) {
    return this;
  });

  __defineProperty(LocalStorage,  "_removeRecord", function(key) {
    return delete this.records[record.id];
  });

  return LocalStorage;

})(Tower.Store.Memory);

module.exports = Tower.Store.LocalStorage;
