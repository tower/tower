var _;

_ = Tower._;

Tower.ModelVersioning = {
  included: function() {
    this.field('version', {
      type: 'Integer',
      "default": 1
    });
    this.hasMany('versions', {
      type: this.className(),
      validate: false,
      cyclic: true,
      inverseOf: null,
      versioned: true,
      embedded: true
    });
    return this.before('save', 'revise', {
      "if": 'isRevisable'
    });
  },
  ClassMethods: {
    isCyclic: true,
    versionMax: 5,
    versionedAttributes: function() {
      if (arguments.length) {
        this._versionedAttributes = _.flatten(_.args(arguments));
      }
      return this._versionedAttributes || (this._versionedAttributes = []);
    },
    maxVersions: function(number) {
      return this.versionMax = parseInt(number);
    }
  },
  revise: function(callback) {
    var _this = this;
    return this.previousRevision(function(error, previous) {
      var newVersion, versionMax, versions;
      if (previous && _this.versionedAttributesChanged()) {
        versions = _this.get('versions');
        newVersion = versions.build(previous.get('versionedAttributes'), {
          withoutProtection: true
        });
        versionMax = _this.constructor.versionMax;
        newVersion.set('id', null);
        _this.set('version', (_this.get('version') || 1) + 1);
        if (versionMax != null) {
          return versions.count(function(error, count) {
            if (count > versionMax) {
              return versions.first(function(error, deleted) {
                if (deleted.isParanoid) {
                  return callback.call(_this);
                } else {
                  return versions.destroy(deleted, function(error) {
                    return callback.call(_this, error);
                  });
                }
              });
            } else {
              return callback.call(_this);
            }
          });
        } else {
          return callback.call(_this);
        }
      }
    });
  },
  previousRevision: function(callback) {
    return this.get('versions').last(callback);
  },
  versionedAttributes: Ember.computed(function() {
    return _.only(this.get('attributes'), this.constructor.versionedAttributes());
  })
};
