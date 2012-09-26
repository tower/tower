var _,
  __slice = [].slice;

_ = Tower._;

Tower.ModelRelations = {
  ClassMethods: {
    hasOne: function(name, options) {
      if (options == null) {
        options = {};
      }
      return this.relations()[name] = new Tower.ModelRelationHasOne(this, name, options);
    },
    hasMany: function(name, options) {
      if (options == null) {
        options = {};
      }
      if (options.hasOwnProperty('through')) {
        return this.relations()[name] = new Tower.ModelRelationHasManyThrough(this, name, options);
      } else {
        return this.relations()[name] = new Tower.ModelRelationHasMany(this, name, options);
      }
    },
    belongsTo: function(name, options) {
      return this.relations()[name] = new Tower.ModelRelationBelongsTo(this, name, options);
    },
    relations: function() {
      return this.metadata().relations;
    },
    relation: function(name) {
      var relation;
      relation = this.relations()[name];
      if (!relation) {
        throw new Error("Relation '" + name + "' does not exist on '" + this.name + "'");
      }
      return relation;
    },
    shouldIncludeTypeInScope: function() {
      return this.baseClass().className() !== this.className();
    }
  },
  InstanceMethods: {
    getAssociation: function(key) {
      return this.constructor.relations()[key];
    },
    getAssociationScope: function(key) {
      return this.get("" + key + "AssociationScope");
    },
    getAssociationCursor: function(key) {
      return this.getAssociationScope(key).cursor;
    },
    fetch: function(key, callback) {
      var record,
        _this = this;
      record = void 0;
      this.getAssociationScope(key).first(function(error, result) {
        record = result;
        if (record && !error) {
          _this.set(key, record);
        }
        if (callback) {
          callback.call(_this, error, record);
        }
        return record;
      });
      return record;
    },
    createAssocation: function() {
      var args, association, name;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      association = this.getAssociationScope(name);
      return association.create.apply(association, args);
    },
    buildAssocation: function() {
      var args, association, name;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      association = this.getAssociationScope(name);
      return association.build.apply(association, args);
    },
    destroyRelations: function(callback) {
      var dependents, iterator, name, relation, relations,
        _this = this;
      relations = this.constructor.relations();
      dependents = [];
      for (name in relations) {
        relation = relations[name];
        if (relation.dependent === true || relation.dependent === 'destroy') {
          dependents.push(name);
        }
      }
      iterator = function(name, next) {
        return _this.get(name).destroy(next);
      };
      return Tower.async(dependents, iterator, callback);
    },
    notifyRelations: function() {
      var name, relation, relations, _results;
      relations = this.constructor.relations();
      _results = [];
      for (name in relations) {
        relation = relations[name];
        _results.push(relation.inverse());
      }
      return _results;
    },
    _setHasManyAssociation: function(key, value, association, options) {
      var cursor, i, id, ids, item, toRemove, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref;
      if (options == null) {
        options = {};
      }
      cursor = this.getAssociationScope(key).cursor;
      value = _.castArray(value);
      for (i = _i = 0, _len = value.length; _i < _len; i = ++_i) {
        item = value[i];
        if (!(item instanceof Tower.Model)) {
          value[i] = cursor.store.serializeModel(item);
        }
      }
      if (this.get('isNew')) {
        this;

      } else {
        cursor._markedForDestruction || (cursor._markedForDestruction = []);
        toRemove = cursor._markedForDestruction.concat();
        ids = [];
        for (_j = 0, _len1 = value.length; _j < _len1; _j++) {
          item = value[_j];
          id = Ember.get(item, 'id');
          if (id != null) {
            ids.push(id.toString());
          }
        }
        _ref = cursor.get('content');
        for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
          item = _ref[_k];
          if (this._checkAssociationRecordForDestroy(item, association)) {
            if (_.indexOf(ids, item.get('id').toString()) === -1) {
              item.set(association.foreignKey, void 0);
              toRemove.push(item);
            }
          }
        }
        if (toRemove.length) {
          cursor._markedForDestruction = toRemove;
        }
      }
      if (value && value.length) {
        for (_l = 0, _len3 = value.length; _l < _len3; _l++) {
          item = value[_l];
          if (item instanceof Tower.Model) {
            item.set(association.foreignKey, this.get('id'));
          } else if (item === null || item === void 0) {
            this;

          } else {
            this;

          }
        }
        cursor.load(value);
      } else {
        cursor.clear();
      }
      return cursor;
    },
    _getHasManyAssociation: function(key) {
      return this.getAssociationScope(key);
    },
    _checkAssociationRecordForDestroy: function(record, association) {
      var foreignId, id;
      foreignId = record.get(association.foreignKey);
      id = this.get('id');
      return (foreignId != null) && (id != null) && foreignId.toString() === id.toString() && !record.attributeChanged(association.foreignKey);
    },
    _setHasOneAssociation: function(key, value, association) {
      var cursor, existingRecord, foreignId, id, record;
      cursor = this.getAssociationCursor(key);
      existingRecord = cursor.objectAt(0);
      if (existingRecord && !cursor._markedForDestruction) {
        foreignId = existingRecord.get(association.foreignKey);
        id = this.get('id');
        if ((foreignId != null) && (id != null) && foreignId.toString() === id.toString() && !existingRecord.attributeChanged(association.foreignKey)) {
          cursor._markedForDestruction = existingRecord;
        }
      }
      if (value instanceof Tower.Model) {
        record = value;
        value.set(association.foreignKey, this.get('id'));
      } else if (value === null || value === void 0) {
        this;

      } else {
        this;

      }
      if (record) {
        cursor.clear();
        cursor.addObject(record);
      }
      return record;
    },
    _getHasOneAssociation: function(key) {
      return this.getAssociationCursor(key).objectAt(0) || this.fetch(key);
    },
    _setBelongsToAssociation: function(key, value, association) {
      var cursor, id, record;
      if (value instanceof Tower.Model) {
        record = value;
        id = value.get('id');
        this.set(association.foreignKey, id);
      } else if (value === null || value === void 0) {
        this.set(association.foreignKey, void 0);
      } else {
        id = value;
        this.set(association.foreignKey, id);
      }
      if (record) {
        cursor = this.getAssociationCursor(key);
        Ember.set(cursor, 'content', []);
        cursor.addObject(record);
      }
      return record;
    },
    _getBelongsToAssociation: function(key) {
      return this.getAssociationCursor(key).objectAt(0) || (function() {
        try {
          return this.fetch(key);
        } catch (_error) {}
      }).call(this);
    }
  }
};

module.exports = Tower.ModelRelations;
