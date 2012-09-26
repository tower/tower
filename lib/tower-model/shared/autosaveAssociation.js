var _;

_ = Tower._;

Tower.ModelAutosaveAssociation = {
  ClassMethods: {
    _addAutosaveAssociationCallbacks: function(association) {
      var isCollection, method, mixin, name, saveMethod, validationMethod;
      name = _.camelize(association.name);
      saveMethod = "_autosaveAssociatedRecordsFor" + name;
      validationMethod = "_validateAssociatedRecordsFor" + name;
      isCollection = association.isCollection;
      mixin = {};
      if (isCollection) {
        this.before('save', '_beforeSaveCollectionAssociation');
        mixin[saveMethod] = function(callback) {
          return this._saveCollectionAssociation(association, callback);
        };
        this.after('create', saveMethod);
        this.after('update', saveMethod);
      } else if (association.isHasOne) {
        mixin[saveMethod] = function(callback) {
          return this._saveHasOneAssociation(association, callback);
        };
        this.after('create', saveMethod);
        this.after('update', saveMethod);
      } else {
        mixin[saveMethod] = function(callback) {
          return this._saveBelongsToAssociation(association, callback);
        };
        this.before('save', saveMethod);
      }
      if (association.validate) {
        method = isCollection ? '_validateCollectionAssociation' : '_validateSingleAssociation';
        mixin[validationMethod] = function(callback) {
          return this[method](association, callback);
        };
      }
      return this.reopen(mixin);
    }
  },
  _beforeSaveCollectionAssociation: function() {
    this.newRecordBeforeSave = this.get('isNew');
    return true;
  },
  _validateSingleAssociation: function(association, callback) {
    var cursor, record;
    cursor = this.getAssociationCursor(association.name);
    if (cursor) {
      record = cursor.objectAt(0);
    }
    if (record) {
      return this._associationIsValid(association, record, callback);
    } else {
      if (callback) {
        callback.call(this);
      }
      return true;
    }
  },
  _validateCollectionAssociation: function(association, callback) {
    var cursor, iterate, records, success,
      _this = this;
    success = void 0;
    cursor = this.getAssociationCursor(association.name);
    if (cursor) {
      records = this._associatedRecordsToValidateOrSave(cursor, this.get('isNew'), association.autosave);
    }
    if (records && records.length) {
      iterate = function(record, next) {
        return _this._associationIsValid(association, record, function(error) {
          if (success !== false) {
            success = !error;
          }
          return next();
        });
      };
      Tower.parallel(records, iterate, function() {
        if (callback) {
          return callback.call(_this, success);
        }
      });
    } else {
      if (callback) {
        callback.call(this, true);
      }
    }
    return success;
  },
  _associationIsValid: function(association, record, callback) {
    var _this = this;
    if (record.get('isDeleted') || record.get('isMarkedForDestruction')) {
      return true;
    }
    return record.validate(function() {
      var array, attribute, error, errors, message, messages, success, _i, _len, _ref;
      error = _.isPresent(record.get('errors'));
      if (error) {
        errors = _this.get('errors');
        if (association.autosave) {
          _ref = record.get('errors');
          for (attribute in _ref) {
            messages = _ref[attribute];
            attribute = "" + association.name + "." + attribute;
            array = errors[attribute] || (errors[attribute] = []);
            for (_i = 0, _len = messages.length; _i < _len; _i++) {
              message = messages[_i];
              array.push(message);
            }
            errors[attribute] = _.uniq(array);
          }
        } else {
          errors[association.name] = ['Invalid'];
        }
      }
      success = !error;
      if (callback) {
        callback.call(_this, error);
      }
      return success;
    });
  },
  _associatedRecordsToValidateOrSave: function(cursor, newRecord, autosave) {
    if (newRecord) {
      return Ember.get(cursor, 'content');
    } else if (autosave) {
      return cursor.filter(function(record) {
        return record._changedForAutosave();
      });
    } else {
      return cursor.filter(function(record) {
        return record.get('isNew');
      });
    }
  },
  _changedForAutosave: function() {
    return this.get('isNew') || this.get('isDirty') || this.get('isMarkedForDestruction') || this._nestedRecordsChangedForAutosave();
  },
  _nestedRecordsChangedForAutosave: function() {
    var _this = this;
    return _.any(this.constructor.relations(), function(association) {
      association = _this.getAssociationScope(association.name);
      return association && _.any(_.compact(_.castArray(association.target)), function(a) {
        return a._changedForAutosave();
      });
    });
  },
  _saveCollectionAssociation: function(association, callback) {
    var _this = this;
    return this._removeOldAssociations(association, function(error) {
      var autosave, createRecord, cursor, foreignKey, key, records, recordsToDestroy, wasNew;
      if (error) {
        console.log(error);
      }
      if (cursor = _this.getAssociationCursor(association.name)) {
        autosave = association.autosave;
        wasNew = !!_this.newRecordBeforeSave;
        if (records = _this._associatedRecordsToValidateOrSave(cursor, wasNew, autosave)) {
          recordsToDestroy = [];
          delete cursor._markedForDestruction;
          foreignKey = association.foreignKey;
          key = _this.get('id');
          createRecord = function(record, next) {
            if (record.get('isDeleted')) {
              return next();
            } else if (autosave && record.get('isMarkedForDestruction')) {
              return recordsToDestroy.push(record);
            } else if (autosave !== false && (wasNew || record.get('isNew'))) {
              if (autosave) {
                record.set(foreignKey, key);
                return record.save({
                  validate: false
                }, next);
              } else if (!association.nested) {
                record.set(foreignKey, key);
                return record.save(next);
              } else {
                return next();
              }
            } else if (autosave) {
              record.set(foreignKey, key);
              return record.save({
                validate: false
              }, next);
            } else {
              return next();
            }
          };
          return Tower.parallel(records, createRecord, function(error) {
            if (error) {
              if (callback) {
                callback.call(_this, error);
              }
              return false;
            } else if (recordsToDestroy.length) {
              return cursor.destroy(recordsToDestroy, function(error) {
                if (callback) {
                  callback.call(_this, error);
                }
                return !error;
              });
            } else {
              if (callback) {
                callback.call(_this);
              }
              return true;
            }
          });
        } else {
          if (callback) {
            callback.call(_this);
          }
          return true;
        }
      }
    });
  },
  _removeOldAssociations: function(association, callback) {
    var cursor, iterate, records,
      _this = this;
    cursor = this.getAssociationCursor(association.name);
    records = cursor._markedForDestruction;
    delete cursor._markedForDestruction;
    if (records && records.length) {
      iterate = function(record, next) {
        return record.save(function(error) {
          return next(error);
        });
      };
      return Tower.parallel(records, iterate, function(error) {
        return callback.call(_this, error);
      });
    } else {
      return callback.call(this);
    }
  },
  _saveHasOneAssociation: function(association, callback) {
    var autosave, foreignKey, key, record,
      _this = this;
    record = this.get(association.name);
    if (record && !record.get('isDeleted')) {
      autosave = association.autosave;
      if (autosave && record.get('isMarkedForDestruction')) {
        return record.destroy(callback);
      } else {
        key = this.get(association.primaryKey ? association.primaryKey : 'id');
        foreignKey = association.foreignKey;
        if (autosave !== false && !this.get('isNew') && (record.get('isNew') || record.get(foreignKey) !== key)) {
          if (!association.isHasManyThrough) {
            record.set(foreignKey, key);
          }
          return record.save({
            validate: !autosave
          }, function(error) {
            callback.call(_this, error);
            return !error;
          });
        } else {
          return callback.call(this);
        }
      }
    } else {
      if (callback) {
        callback.call(this);
      }
      return true;
    }
  },
  _saveBelongsToAssociation: function(association, callback) {
    var autosave, record, saved,
      _this = this;
    record = this.get(association.name);
    if (record && !record.get('isDeleted')) {
      autosave = association.autosave;
      if (autosave && record.get('isMarkedForDestruction')) {
        return record.destroy(callback);
      } else if (autosave !== false) {
        saved = false;
        if (record.get('isNew') || (autosave && record._changedForAutosave())) {
          record.save({
            validate: !autosave
          }, function(error) {
            saved = !error;
            if (!error) {
              _this.set(association.foreignKey, record.get(association.primaryKey || 'id'));
            }
            return _["return"](_this, callback, error);
          });
        } else {
          saved = true;
          if (callback) {
            callback.call(this);
          }
        }
        return saved;
      } else {
        if (callback) {
          callback.call(this);
        }
        return true;
      }
    } else {
      if (callback) {
        callback.call(this);
      }
      return true;
    }
  }
};

module.exports = Tower.ModelAutosaveAssociation;
