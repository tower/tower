var _,
  __slice = [].slice;

_ = Tower._;

Tower.ModelMassAssignment = {
  ClassMethods: {
    readOnly: function() {
      var keys;
      keys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    },
    readOnlyAttributes: function() {},
    "protected": function() {
      return this._attributeAssignment.apply(this, ['protected'].concat(__slice.call(arguments)));
    },
    protectedAttributes: function() {
      var array, blacklist;
      if (this._protectedAttributes) {
        return this._protectedAttributes;
      }
      array = ['id'];
      blacklist = {
        'default': array
      };
      blacklist._deny = function(key) {
        return key === 'id' || _.include(this, key);
      };
      array.deny = blacklist._deny;
      blacklist;

      return this._protectedAttributes = blacklist;
    },
    accessibleAttributes: function() {
      var whitelist;
      if (this._attributeAssignment) {
        return this._attributeAssignment;
      }
      whitelist = {};
      whitelist._deny = function(key) {
        return key === 'id' || !_.include(this, key);
      };
      whitelist;

      return this._accessibleAttributes = whitelist;
    },
    activeAuthorizer: function() {
      return this._activeAuthorizer || (this._activeAuthorizer = this.protectedAttributes());
    },
    accessible: function() {
      return this._attributeAssignment.apply(this, ['accessible'].concat(__slice.call(arguments)));
    },
    _attributeAssignment: function(type) {
      var args, assignments, attributes, options, role, roles, _i, _len;
      args = _.args(arguments, 1);
      options = _.extractOptions(args);
      roles = _.castArray(options.as || 'default');
      assignments = this["" + type + "Attributes"]();
      for (_i = 0, _len = roles.length; _i < _len; _i++) {
        role = roles[_i];
        attributes = assignments[role];
        if (attributes) {
          attributes = attributes.concat(args);
        } else {
          attributes = args;
        }
        attributes.deny = assignments._deny;
        assignments[role] = attributes;
      }
      this._activeAuthorizer = assignments;
      return this;
    }
  },
  _sanitizeForMassAssignment: function(attributes, role) {
    var authorizer, key, rejected, sanitizedAttributes, _i, _len, _ref;
    if (role == null) {
      role = 'default';
    }
    rejected = [];
    authorizer = this.constructor.activeAuthorizer()[role];
    sanitizedAttributes = {};
    _ref = _.keys(attributes);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      if (authorizer.deny(key)) {
        rejected.push(key);
      } else {
        sanitizedAttributes[key] = attributes[key];
      }
    }
    if (!_.isEmpty(rejected)) {
      this._processRemovedAttributes(rejected);
    }
    return sanitizedAttributes;
  },
  _processRemovedAttributes: function(keys) {}
};

module.exports = Tower.ModelMassAssignment;
