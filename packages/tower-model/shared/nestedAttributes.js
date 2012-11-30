var _,
  __slice = [].slice;

_ = Tower._;

Tower.ModelNestedAttributes = {
  ClassMethods: {
    acceptsNestedAttributesFor: function() {
      var key, keys, mixin, _i, _len;
      keys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      mixin = {};
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        mixin["" + key + "Attributes"] = this._defineMethodForNestedAttributes(key);
      }
      return this.reopen(mixin);
    },
    _defineMethodForNestedAttributes: function(key) {
      var relation, type;
      relation = this.relation(key);
      relation.autosave = true;
      this._addAutosaveAssociationCallbacks(relation);
      type = _.camelize(relation.relationType);
      return function(attributes, massAssignmentOptions) {
        if (massAssignmentOptions == null) {
          massAssignmentOptions = {};
        }
        return this["_assignNestedAttributesFor" + type + "Association"](key, attributes, massAssignmentOptions);
      };
    }
  },
  _assignNestedAttributesForCollectionAssociation: function(key, attributesCollection, assignmentOptions) {
    var association, attributeIds, attributes, existingRecord, existingRecords, limit, options, rejected, targetRecord, _i, _len, _results;
    if (!(_.isHash(attributesCollection) || _.isArray(attributesCollection))) {
      throw new Error("Hash or Array expected, got " + (_.camelize(_.kind(attributesCollection))), attributesCollection);
    }
    options = {};
    limit = options.limit;
    attributesCollection = _.castArray(attributesCollection);
    association = this.constructor.relations()[key].scoped(this);
    existingRecords = association.isLoaded ? association.target : (attributeIds = _.map(attributesCollection, function(i) {
      return i.id;
    }), _.isEmpty(attributeIds) ? attributeIds : association.where(association.cursor.relation.klass().primaryKey, attributeIds));
    _results = [];
    for (_i = 0, _len = attributesCollection.length; _i < _len; _i++) {
      attributes = attributesCollection[_i];
      if (_.isBlank(attributes['id'])) {
        if (!this._callRejectIf(key, attributes)) {
          _results.push(association.build(_.except(attributes, this._unassignableKeys(assignmentOptions)), assignmentOptions));
        } else {
          _results.push(void 0);
        }
      } else if (existingRecord = _.detect(existingRecords, function(record) {
        return record.id.toString() === attributes['id'].toString();
      })) {
        rejected = this._callRejectIf(key, attributes);
        if (!(association.isLoaded || rejected)) {
          targetRecord = _.detect(association.target, function(record) {
            return record.equals(existingRecord);
          });
          if (targetRecord) {
            existingRecord = targetRecord;
          } else {
            association.addToTarget(existingRecord);
          }
        }
        if (!rejected) {
          _results.push(this._assignToOrMarkForDestruction(existingRecord, attributes, options.allow_destroy, assignmentOptions));
        } else {
          _results.push(void 0);
        }
      } else if (assignmentOptions.withoutProtection) {
        _results.push(association.build(_.except(attributes, this._unassignableKeys(assignmentOptions)), assignmentOptions));
      } else {
        _results.push(this);
      }
    }
    return _results;
  },
  _assignNestedAttributesForSingularAssociation: function(key, attributes, assignmentOptions) {
    var association, hasId, options, record, rejected, updatable;
    if (assignmentOptions == null) {
      assignmentOptions = {};
    }
    options = {};
    hasId = !_.isBlank(attributes['id']);
    record = this.get(key);
    updatable = !!(options.updateOnly || (hasId && record && record.get('id').toString() === attributes['id'].toString()));
    rejected = this._callRejectIf(key, attributes);
    if (updatable && !rejected) {
      return this._assignToOrMarkForDestruction(record, attributes, options.allowDestroy, assignmentOptions);
    } else if (!hasId && !assignmentOptions.withoutProtection) {
      return this;
    } else if (!rejected) {
      association = this.getAssociationScope(key);
      if (association) {
        return association.build(_.except(attributes, this._unassignableKeys(assignmentOptions)), assignmentOptions);
      } else {
        throw new Error("Cannot build association " + key + ". Are you trying to build a polymorphic one-to-one association?");
      }
    }
  },
  _assignToOrMarkForDestruction: function(record, attributes, allowDestroy, assignmentOptions) {
    record.assignAttributes(_.except(attributes, this._unassignableKeys(assignmentOptions)), assignmentOptions);
    if (this._hasDestroyFlag(attributes) && allowDestroy) {
      return record.markForDestruction();
    }
  },
  _callRejectIf: function(key, attributes) {
    var callback;
    if (this._hasDestroyFlag(attributes)) {
      return false;
    }
    callback = null;
    switch (typeof callback) {
      case 'string':
        return this[callback].call(this, attributes);
      case 'function':
        return callback.call(this, attributes);
    }
  },
  _unassignableKeys: function(assignmentOptions) {
    if (assignmentOptions.withoutProtection) {
      return ['_destroy'];
    } else {
      return ['id', '_destroy'];
    }
  },
  _hasDestroyFlag: function(attributes) {
    return attributes.hasOwnProperty('_destroy');
  }
};

module.exports = Tower.ModelNestedAttributes;
