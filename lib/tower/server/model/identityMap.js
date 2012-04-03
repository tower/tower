
Tower.Model.IdentityMap = {
  repository: {},
  get: function(klass, key) {
    return this.collection(klass)[key];
  },
  add: function(record) {
    return this.collection(record)[record.get("id")] = record;
  },
  remove: function(record) {
    return delete this.collection(record)[record.get("id")];
  },
  collection: function(object) {
    var _base, _name;
    if (typeof object !== "function") object = object.constructor;
    return (_base = this.repository)[_name = object.name] || (_base[_name] = {});
  }
};

module.exports = Tower.Model.IdentityMap;
