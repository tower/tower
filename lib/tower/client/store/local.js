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

Tower.Store.Local = (function(_super) {
  var Local;

  function Local() {
    return Local.__super__.constructor.apply(this, arguments);
  }

  Local = __extends(Local, _super);

  __defineProperty(Local,  "initialize", function() {
    return this.lastId = 0;
  });

  __defineProperty(Local,  "_setRecord", function(record) {});

  __defineProperty(Local,  "_getRecord", function(key) {
    return this;
  });

  __defineProperty(Local,  "_removeRecord", function(key) {
    return delete this.records[record.id];
  });

  return Local;

})(Tower.Store.Memory);

module.exports = Tower.Store.Local;
