
Tower.Store.Modifiers = {
  MAP: {
    "$set": "$set",
    "$unset": "$unset",
    "$push": "$push",
    "$pushEach": "$pushEach",
    "$pull": "$pull",
    "$pullEach": "$pullEach",
    "$remove": "$pull",
    "$removeEach": "$pullEach",
    "$inc": "$inc",
    "$pop": "$pop",
    "$add": "$add",
    "$addEach": "$addEach",
    "$addToSet": "$add"
  },
  SET: ["push", "pushEach", "pull", "pullEach", "inc", "add", "addEach", "remove", "removeEach", "unset"],
  set: function(key, value) {
    return _.oneOrMany(this, this._set, key, value);
  },
  push: function(key, value) {
    return _.oneOrMany(this, this._push, key, value);
  },
  pushEach: function(key, value) {
    return _.oneOrMany(this, this._push, key, value, true);
  },
  pull: function(key, value) {
    return _.oneOrMany(this, this._pull, key, value);
  },
  pullEach: function(key, value) {
    return _.oneOrMany(this, this._pull, key, value, true);
  },
  inc: function(key, value) {
    return _.oneOrMany(this, this._inc, key, value);
  },
  add: function(key, value) {
    return _.oneOrMany(this, this._add, key, value);
  },
  unset: function() {
    var key, keys, _i, _len;
    keys = _.flatten(_.args(arguments));
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      delete this[key];
    }
    return;
  },
  _set: function(key, value) {},
  _push: function(key, value, array) {
    if (array == null) {
      array = false;
    }
  },
  _pull: function(key, value, array) {
    if (array == null) {
      array = false;
    }
  },
  _inc: function(key, value) {},
  _add: function(key, value) {},
  _remove: function(key, value) {}
};

module.exports = Tower.Store.Modifiers;
