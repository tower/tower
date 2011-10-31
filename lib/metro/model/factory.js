Metro.Model.Factory = (function() {
  function Factory() {}
  Factory.store = function() {
    return this._store || (this._store = new Metro.Store.Memory);
  };
  Factory.define = function(name, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    options || (options = {});
    return this.store()[name] = [options, callback];
  };
  Factory.build = function(name, overrides) {
    var attributes, key, value;
    attributes = this.store()[name][1]();
    for (key in overrides) {
      value = overrides[key];
      attributes[key] = value;
    }
    return new (global[name](attributes));
  };
  Factory.create = function(name, overrides) {
    var record;
    record = this.build(name, overrides);
    record.save();
    return record;
  };
  return Factory;
})();