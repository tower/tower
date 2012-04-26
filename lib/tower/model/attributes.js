(function() {
  var __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Tower.Model.Attributes = {
    ClassMethods: {
      field: function(name, options) {
        return this.fields()[name] = new Tower.Model.Attribute(this, name, options);
      },
      fields: function() {
        var fields, name, names, options, _i, _len, _ref;
        fields = this.metadata().fields;
        switch (arguments.length) {
          case 0:
            fields;
            break;
          case 1:
            _ref = arguments[0];
            for (name in _ref) {
              options = _ref[name];
              this.field(name, options);
            }
            break;
          default:
            names = _.args(arguments);
            options = _.extractOptions(names);
            for (_i = 0, _len = names.length; _i < _len; _i++) {
              name = names[_i];
              this.field(name, options);
            }
        }
        return fields;
      }
    },
    InstanceMethods: {
      get: function(name) {
        var field;
        field = this.constructor.fields()[name];
        if (!this.has(name)) {
          if (field) this.attributes[name] = field.defaultValue(this);
        }
        if (field) {
          return field.decode(this.attributes[name], this);
        } else {
          return this.attributes[name];
        }
      },
      assignAttributes: function(attributes) {
        var key, value;
        for (key in attributes) {
          value = attributes[key];
          delete this.changes[key];
          this.attributes[key] = value;
        }
        return this;
      },
      has: function(key) {
        return this.attributes.hasOwnProperty(key);
      },
      set: function(key, value) {
        var _this = this;
        return this.operation(function() {
          return Tower.oneOrMany(_this, _this._set, key, value);
        });
      },
      push: function(key, value) {
        var _this = this;
        return this.operation(function() {
          return Tower.oneOrMany(_this, _this._push, key, value);
        });
      },
      pushAll: function(key, value) {
        var _this = this;
        return this.operation(function() {
          return Tower.oneOrMany(_this, _this._push, key, value, true);
        });
      },
      pull: function(key, value) {
        var _this = this;
        return this.operation(function() {
          return Tower.oneOrMany(_this, _this._pull, key, value);
        });
      },
      pullAll: function(key, value) {
        var _this = this;
        return this.operation(function() {
          return Tower.oneOrMany(_this, _this._pull, key, value, true);
        });
      },
      inc: function(key, value) {
        var _this = this;
        return this.operation(function() {
          return Tower.oneOrMany(_this, _this._inc, key, value);
        });
      },
      addToSet: function(key, value) {
        var _this = this;
        return this.operation(function() {
          return Tower.oneOrMany(_this, _this._addToSet, key, value);
        });
      },
      unset: function() {
        var key, keys, _i, _len;
        keys = _.flatten(Tower.args(arguments));
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          key = keys[_i];
          delete this.attributes[key];
        }
        return;
      },
      _set: function(key, value) {
        var after, before, field, fields, operation, _ref;
        if (Tower.Store.atomicModifiers.hasOwnProperty(key)) {
          return this[key.replace(/^\$/, "")](value);
        } else {
          fields = this.constructor.fields();
          field = fields[key];
          if (field) value = field.encode(value, this);
          _ref = this.changes, before = _ref.before, after = _ref.after;
          this._attributeChange(key, value);
          if (!before.hasOwnProperty(key)) before[key] = this.get(key);
          after.$set || (after.$set = {});
          after.$set[key] = value;
          if (operation = this._currentOperation) {
            operation.$set || (operation.$set = {});
            operation.$set[key] = value;
          }
          return this.attributes[key] = value;
        }
      },
      _push: function(key, value, array) {
        var after, before, current, fields, operation, push, _ref;
        if (array == null) array = false;
        fields = this.constructor.fields();
        if (__indexOf.call(fields, key) >= 0) value = fields[key].encode(value);
        _ref = this.changes, before = _ref.before, after = _ref.after;
        push = after.$push || (after.$push = {});
        before[key] || (before[key] = this.get(key));
        current = this.get(key) || [];
        push[key] || (push[key] = current.concat());
        if (array === true && _.isArray(value)) {
          push[key] = push[key].concat(value);
        } else {
          push[key].push(value);
        }
        if (operation = this._currentOperation) {
          operation.$push || (operation.$push = {});
          operation.$push[key] = value;
        }
        return this.attributes[key] = push[key];
      },
      _pull: function(key, value, array) {
        var after, before, current, fields, item, operation, pull, _i, _len, _ref;
        if (array == null) array = false;
        fields = this.constructor.fields();
        if (__indexOf.call(fields, key) >= 0) value = fields[key].encode(value);
        _ref = this.changes, before = _ref.before, after = _ref.after;
        pull = after.$pull || (after.$pull = {});
        before[key] || (before[key] = this.get(key));
        current = this.get(key) || [];
        pull[key] || (pull[key] = current.concat());
        if (array && _.isArray(value)) {
          for (_i = 0, _len = value.length; _i < _len; _i++) {
            item = value[_i];
            pull[key].splice(pull[key].indexOf(item), 1);
          }
        } else {
          pull[key].splice(pull[key].indexOf(value), 1);
        }
        if (operation = this._currentOperation) {
          operation.$pull || (operation.$pull = {});
          operation.$pull[key] = value;
        }
        return this.attributes[key] = pull[key];
      },
      _inc: function(key, value) {
        var after, before, fields, inc, operation, _ref;
        fields = this.constructor.fields();
        if (__indexOf.call(fields, key) >= 0) value = fields[key].encode(value);
        _ref = this.changes, before = _ref.before, after = _ref.after;
        inc = after.$inc || (after.$inc = {});
        if (!before.hasOwnProperty(key)) before[key] = this.get(key);
        inc[key] = this.get(key) || 0;
        inc[key] += value;
        if (operation = this._currentOperation) {
          operation.$before || (operation.$before = {});
          if (!operation.$before.hasOwnProperty(key)) {
            operation.$before[key] = this.get(key);
          }
          operation.$inc || (operation.$inc = {});
          operation.$inc[key] = value;
          operation.$after || (operation.$after = {});
          operation.$after[key] = inc[key];
        }
        return this.attributes[key] = inc[key];
      },
      _addToSet: function(key, value) {
        var addToSet, after, before, current, fields, item, _i, _len, _ref, _ref2;
        fields = this.constructor.fields();
        if (__indexOf.call(fields, key) >= 0) value = fields[key].encode(value);
        _ref = this.changes, before = _ref.before, after = _ref.after;
        addToSet = after.$addToSet || (after.$addToSet = {});
        before[key] || (before[key] = this.get(key));
        current = this.get(key) || [];
        addToSet[key] || (addToSet[key] = current.concat());
        if (value && value.hasOwnProperty("$each")) {
          _ref2 = value.$each;
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            item = _ref2[_i];
            if (addToSet[key].indexOf(item) === -1) addToSet[key].push(item);
          }
        } else {
          if (addToSet[key].indexOf(value) === -1) addToSet[key].push(value);
        }
        return this.attributes[key] = addToSet[key];
      }
    }
  };

  module.exports = Tower.Model.Attributes;

}).call(this);
