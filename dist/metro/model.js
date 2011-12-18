(function() {
  var key, _fn, _fn2, _i, _j, _len, _len2, _ref, _ref2;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __slice = Array.prototype.slice;

  Metro.Model = (function() {

    __extends(Model, Metro.Object);

    function Model(attrs) {
      var attributes, definition, definitions, key, name, value;
      if (attrs == null) attrs = {};
      definitions = this.constructor.fields();
      attributes = {};
      for (key in attrs) {
        value = attrs[key];
        attributes[key] = value;
      }
      for (name in definitions) {
        definition = definitions[name];
        if (!attrs.hasOwnProperty(name)) {
          attributes[name] || (attributes[name] = definition.defaultValue(this));
        }
      }
      this.attributes = attributes;
      this.changes = {};
      this.errors = {};
      this.readonly = false;
    }

    return Model;

  })();

  /*
  Passing options hash containing :conditions, :include, :joins, :limit, :offset, :order, :select, :readonly, :group, :having, :from, :lock to any of the ActiveRecord provided class methods, is now deprecated.
  
  New AR 3.0 API:
  
      new(attributes)
      create(attributes)
      create!(attributes)
      find(id_or_array)
      destroy(id_or_array)
      destroy_all
      delete(id_or_array)
      delete_all
      update(ids, updates)
      update_all(updates)
      exists?
      
      first
      all
      last
      find(1)
      
  success:  
    string:
      User.where(title: $in: ["Hello", "World"]).all()
      User.where(title: $eq: "Hello").all()
      User.where(title: "Hello").all()
      User.where(title: "=~": "Hello").all()
      User.where(title: "=~": /Hello/).all()
      
      # create from scope only if exact matches
      User.where(title: "Hello").create()
    
    id:  
      User.find(1)
      User.find(1, 2, 3)
      User.where(id: $in: [1, 2, 3]).all()
      User.where(id: $nin: [1, 2, 3]).all()
      User.where($or: [{id: 1}, {username: "john"}]).all()
      User.anyIn(id: [1, 2, 3]).all()
      User.excludes(firstName: "Hello", lastName: "World").all()
      
    order:
      User.asc("id").desc("username").all()
      User.order(["asc", "id"], ["desc", "username"]).all()
      User.where(username: "=~": /^a/).asc("username").desc("createdAt").all()
      
    date:
      User.where(createdAt: ">=": 10000000).where(createdAt: "<=": 40000000).all()
      
    nested:
      User.where(posts: createdAt: ">=": x).all()
      
  fail:
    string:  
      User.where(title: $in: ["Hello", "World"]).create()
  */

  Metro.Model.Scope = (function() {
    var key, _fn, _i, _len, _ref;

    __extends(Scope, Metro.Object);

    Scope.scopes = ["where", "order", "asc", "desc", "limit", "offset", "select", "joins", "includes", "excludes", "paginate", "within"];

    Scope.finders = ["find", "all", "first", "last", "count"];

    Scope.builders = ["build", "create", "update", "updateAll", "delete", "deleteAll", "destroy", "destroyAll"];

    function Scope(options) {
      if (options == null) options = {};
      this.model = options.model;
      this.criteria = options.criteria || new Metro.Model.Criteria;
    }

    _ref = Scope.scopes;
    _fn = function(_key) {
      return this.prototype[_key] = function() {
        var _ref2;
        (_ref2 = this.criteria)[_key].apply(_ref2, arguments);
        return this;
      };
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      _fn.call(Scope, key);
    }

    Scope.prototype.find = function() {
      var callback, ids, _j, _ref2;
      ids = 2 <= arguments.length ? __slice.call(arguments, 0, _j = arguments.length - 1) : (_j = 0, []), callback = arguments[_j++];
      return (_ref2 = this.store()).find.apply(_ref2, __slice.call(ids).concat([this.criteria.query], [this.criteria.options], [callback]));
    };

    Scope.prototype.all = function(callback) {
      return this.store().all(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.first = function(callback) {
      return this.store().first(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.last = function(callback) {
      return this.store().last(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.count = function(callback) {
      return this.store().count(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.build = function(attributes, callback) {
      return this.store().build(Metro.Support.Object.extend(this.criteria.query, attributes), this.criteria.options, callback);
    };

    Scope.prototype.create = function(attributes, callback) {
      return this.store().create(Metro.Support.Object.extend(this.criteria.query, attributes), this.criteria.options, callback);
    };

    Scope.prototype.update = function() {
      var callback, ids, updates, _j, _ref2;
      ids = 3 <= arguments.length ? __slice.call(arguments, 0, _j = arguments.length - 2) : (_j = 0, []), updates = arguments[_j++], callback = arguments[_j++];
      return (_ref2 = this.store()).update.apply(_ref2, __slice.call(ids).concat([updates], [this.criteria.query], [this.criteria.options], [callback]));
    };

    Scope.prototype.updateAll = function(updates, callback) {
      return this.store().updateAll(updates, this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype["delete"] = function() {
      var callback, ids, _j, _ref2;
      ids = 2 <= arguments.length ? __slice.call(arguments, 0, _j = arguments.length - 1) : (_j = 0, []), callback = arguments[_j++];
      return (_ref2 = this.store())["delete"].apply(_ref2, __slice.call(ids).concat([this.criteria.query], [this.criteria.options], [callback]));
    };

    Scope.prototype.deleteAll = function(callback) {
      return this.store().deleteAll(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.destroy = function() {
      var callback, ids, _j, _ref2;
      ids = 2 <= arguments.length ? __slice.call(arguments, 0, _j = arguments.length - 1) : (_j = 0, []), callback = arguments[_j++];
      return (_ref2 = this.store())["delete"].apply(_ref2, __slice.call(ids).concat([this.criteria.query], [this.criteria.options], [callback]));
    };

    Scope.prototype.destroyAll = function(callback) {
      return this.store().deleteAll(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.store = function() {
      return this.model.store();
    };

    Scope.prototype.clone = function() {
      return new this({
        model: this.model,
        criteria: this.criteria.clone()
      });
    };

    return Scope;

  })();

  Metro.Model.Callbacks = {};

  Metro.Model.Criteria = (function() {

    function Criteria(query, options) {
      if (query == null) query = {};
      if (options == null) options = {};
      this.query = query;
      this.options = options;
    }

    Criteria.prototype._mergeQuery = function(conditions) {
      if (conditions == null) conditions = {};
      return Metro.Support.Object.extend(this.query, conditions);
    };

    Criteria.prototype._mergeOptions = function(options) {
      if (options == null) options = {};
      return Metro.Support.Object.extend(this.options, options);
    };

    Criteria.prototype.where = function(conditions) {
      return this._mergeQuery(conditions);
    };

    Criteria.prototype.order = function(attribute, direction) {
      if (direction == null) direction = "asc";
      return this._mergeOptions({
        sort: [attribute, direction]
      });
    };

    Criteria.prototype.offset = function(number) {
      return this._mergeOptions({
        offset: number
      });
    };

    Criteria.prototype.limit = function(number) {
      return this._mergeOptions({
        limit: number
      });
    };

    Criteria.prototype.select = function() {
      return this._mergeOptions({
        fields: Metro.Support.Array.args(arguments)
      });
    };

    Criteria.prototype.joins = function() {
      return this._mergeOptions({
        joins: Metro.Support.Array.args(arguments)
      });
    };

    Criteria.prototype.includes = function() {
      return this._mergeOptions({
        includes: Metro.Support.Array.args(arguments)
      });
    };

    Criteria.prototype.paginate = function(options) {
      var limit, page;
      limit = options.perPage || options.limit;
      page = options.page || 0;
      this.limit(limit);
      return this.offset(page * limit);
    };

    Criteria.prototype.within = function(options) {
      return this;
    };

    Criteria.prototype.clone = function() {
      return new this(Metro.Support.Object.cloneHash(this.query), Metro.Support.Object.cloneHash(this.options));
    };

    return Criteria;

  })();

  Metro.Model.Dirty = {
    isDirty: function() {
      return Metro.Support.Object.isPresent(this.changes);
    },
    _attributeChange: function(attribute, value) {
      var array, beforeValue, _base;
      array = (_base = this.changes)[attribute] || (_base[attribute] = []);
      beforeValue = array[0] || (array[0] = this.attributes[attribute]);
      array[1] = value;
      if (array[0] === array[1]) array = null;
      if (array) {
        this.changes[attribute] = array;
      } else {
        delete this.changes[attribute];
      }
      return beforeValue;
    },
    toUpdates: function() {
      var array, attributes, key, result, _ref;
      result = {};
      attributes = this.attributes;
      _ref = this.changes;
      for (key in _ref) {
        array = _ref[key];
        result[key] = attributes[key];
      }
      return result;
    }
  };

  Metro.Model.Metadata = {
    ClassMethods: {
      baseClass: function() {
        if (this.__super__ && this.__super__.constructor.baseClass && this.__super__.constructor !== Metro.Model) {
          return this.__super__.constructor.baseClass();
        } else {
          return this;
        }
      },
      stiName: function() {},
      toParam: function() {
        return Metro.Support.String.parameterize(this.className());
      }
    },
    toLabel: function() {
      return this.className();
    },
    toPath: function() {
      return this.constructor.toParam() + "/" + this.toParam();
    },
    toParam: function() {
      return this.get("id").toString();
    }
  };

  Metro.Model.Inheritance = {
    _computeType: function() {}
  };

  Metro.Model.Relation = (function() {

    __extends(Relation, Metro.Object);

    function Relation(owner, name, options, callback) {
      var key, value;
      if (options == null) options = {};
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
      this.owner = owner;
      this.name = name;
      this.targetClassName = options.type || options.className || Metro.namespaced(Metro.Support.String.camelize(name));
      this.dependent || (this.dependent = false);
      this.counterCache || (this.counterCache = false);
      if (!this.hasOwnProperty("cache")) this.cache = false;
      if (!this.hasOwnProperty("readOnly")) this.readOnly = false;
      if (!this.hasOwnProperty("validate")) this.validate = false;
      if (!this.hasOwnProperty("autoSave")) this.autoSave = false;
      if (!this.hasOwnProperty("touch")) this.touch = false;
      this.inverseOf || (this.inverseOf = void 0);
      if (!this.hasOwnProperty("polymorphic")) this.polymorphic = false;
      if (!this.hasOwnProperty("default")) this["default"] = false;
    }

    Relation.prototype.scoped = function(record) {
      return new this.constructor.Scope({
        model: Metro.constant(this.targetClassName),
        owner: record,
        relation: this
      });
    };

    Relation.Scope = (function() {

      __extends(Scope, Metro.Model.Scope);

      Scope.prototype.constructable = function() {
        return !!!this.relation.polymorphic;
      };

      function Scope(options) {
        if (options == null) options = {};
        Scope.__super__.constructor.apply(this, arguments);
        this.owner = options.owner;
        this.relation = options.relation;
        this.foreignKey = this.relation.foreignKey;
      }

      return Scope;

    })();

    return Relation;

  })();

  Metro.Model.Relation.BelongsTo = (function() {

    __extends(BelongsTo, Metro.Model.Relation);

    function BelongsTo(owner, name, options) {
      var self;
      if (options == null) options = {};
      BelongsTo.__super__.constructor.call(this, owner, name, options);
      owner.field("" + name + "Id", {
        type: "Id"
      });
      owner.prototype[name] = function(callback) {
        return this.relation(name).first(callback);
      };
      self = this;
      owner.prototype["build" + (Metro.Support.String.camelize(name))] = function(attributes, callback) {
        return this.buildRelation(name, attributes, callback);
      };
      owner.prototype["create" + (Metro.Support.String.camelize(name))] = function(attributes, callback) {
        return this.createRelation(name, attributes, callback);
      };
    }

    BelongsTo.Scope = (function() {

      __extends(Scope, BelongsTo.Scope);

      function Scope() {
        Scope.__super__.constructor.apply(this, arguments);
      }

      return Scope;

    })();

    return BelongsTo;

  })();

  Metro.Model.Relation.HasMany = (function() {

    __extends(HasMany, Metro.Model.Relation);

    function HasMany(owner, name, options) {
      if (options == null) options = {};
      HasMany.__super__.constructor.call(this, owner, name, options);
      owner.prototype[name] = function() {
        return this.relation(name);
      };
      this.foreignKey = options.foreignKey || Metro.Support.String.camelize("" + owner.name + "Id", true);
      if (this.cache) {
        if (typeof this.cache === "string") {
          this.cache = true;
          this.cacheKey = this.cacheKey;
        } else {
          this.cacheKey = Metro.Support.String.singularize(name) + "Ids";
        }
        this.owner.field(this.cacheKey, {
          type: "Array",
          "default": []
        });
      }
    }

    HasMany.Scope = (function() {

      __extends(Scope, HasMany.Scope);

      function Scope(options) {
        var defaults, id;
        if (options == null) options = {};
        Scope.__super__.constructor.apply(this, arguments);
        id = this.owner.get("id");
        if (this.foreignKey && id !== void 0) {
          defaults = {};
          defaults[this.foreignKey] = id;
          this.where(defaults);
        }
      }

      Scope.prototype.create = function(attributes, callback) {
        var relation, self;
        self = this;
        relation = this.relation;
        return this.store().create(Metro.Support.Object.extend(this.criteria.query, attributes), this.criteria.options, function(error, record) {
          var updates;
          if (!error) {
            if (relation && relation.cache) {
              updates = {};
              updates[relation.cacheKey] = record.get("id");
              return self.owner.updateAttributes({
                "$push": updates
              }, callback);
            } else {
              if (callback) return callback.call(this, error, record);
            }
          } else {
            if (callback) return callback.call(this, error, record);
          }
        });
      };

      return Scope;

    })();

    return HasMany;

  })();

  Metro.Model.Relation.HasOne = (function() {

    __extends(HasOne, Metro.Model.Relation);

    function HasOne() {
      HasOne.__super__.constructor.apply(this, arguments);
    }

    return HasOne;

  })();

  Metro.Model.Relations = {
    ClassMethods: {
      hasOne: function(name, options) {
        return this.relations()[name] = new Metro.Model.Relation.HasOne(this, name, options);
      },
      hasMany: function(name, options) {
        return this.relations()[name] = new Metro.Model.Relation.HasMany(this, name, options);
      },
      belongsTo: function(name, options) {
        return this.relations()[name] = new Metro.Model.Relation.BelongsTo(this, name, options);
      },
      relations: function() {
        return this._relations || (this._relations = {});
      },
      relation: function(name) {
        var relation;
        relation = this.relations()[name];
        if (!relation) {
          throw new Error("Relation '" + name + "' does not exist on '" + this.name + "'");
        }
        return relation;
      }
    },
    InstanceMethods: {
      relation: function(name) {
        return this.constructor.relation(name).scoped(this);
      },
      buildRelation: function(name, attributes, callback) {
        return this.relation(name).build(attributes, callback);
      },
      createRelation: function(name, attributes, callback) {
        return this.relation(name).create(attributes, callback);
      }
    }
  };

  Metro.Model.Field = (function() {

    function Field(owner, name, options) {
      var key;
      if (options == null) options = {};
      this.owner = owner;
      this.name = key = name;
      this.type = options.type || "string";
      this._default = options["default"];
      this._encode = options.encode;
      this._decode = options.decode;
      if (Metro.accessors) {
        Object.defineProperty(this.owner.prototype, name, {
          enumerable: true,
          configurable: true,
          get: function() {
            return this.get(key);
          },
          set: function(value) {
            return this.set(key, value);
          }
        });
      }
    }

    Field.prototype.defaultValue = function(record) {
      var _default;
      _default = this._default;
      if (Metro.Support.Object.isArray(_default)) {
        return _default.concat();
      } else if (Metro.Support.Object.isHash(_default)) {
        return Metro.Support.Object.extend({}, _default);
      } else if (typeof _default === "function") {
        return _default.call(record);
      } else {
        return _default;
      }
    };

    Field.prototype.encode = function(value, binding) {
      return this.code(this._encode, value, binding);
    };

    Field.prototype.decode = function(value, binding) {
      return this.code(this._decode, value, binding);
    };

    Field.prototype.code = function(type, value, binding) {
      switch (type) {
        case "string":
          return binding[type].call(binding[type], value);
        case "function":
          return type.call(_encode, value);
        default:
          return value;
      }
    };

    return Field;

  })();

  Metro.Model.Versioning = {};

  Metro.Model.Fields = {
    ClassMethods: {
      field: function(name, options) {
        return this.fields()[name] = new Metro.Model.Field(this, name, options);
      },
      fields: function() {
        return this._fields || (this._fields = {});
      },
      schema: function() {
        return this.fields();
      }
    },
    InstanceMethods: {
      get: function(name) {
        if (!this.has(name)) {
          this.attributes[name] = this.constructor.fields()[name].defaultValue(this);
        }
        return this.attributes[name];
      },
      set: function(name, value) {
        var beforeValue;
        beforeValue = this._attributeChange(name, value);
        this.attributes[name] = value;
        this.fire("change", {
          beforeValue: beforeValue,
          value: value
        });
        return value;
      },
      has: function(name) {
        return this.attributes.hasOwnProperty(name);
      }
    }
  };

  Metro.Model.Persistence = {
    ClassMethods: {
      load: function(array) {
        var item, record, records, _i, _len;
        if (!Metro.Support.Object.isArray(array)) array = [array];
        records = this.store().records;
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          item = array[_i];
          record = item instanceof Metro.Model ? item : new this(item);
          records[record.id] = record;
        }
        return records;
      },
      create: function(attributes, callback) {
        return this.scoped().create(attributes, callback);
      },
      update: function() {
        var callback, ids, updates, _i, _ref;
        ids = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), updates = arguments[_i++], callback = arguments[_i++];
        return (_ref = this.scoped()).update.apply(_ref, __slice.call(ids).concat([updates], [callback]));
      },
      updateAll: function(updates, query, callback) {
        return this.scoped().updateAll(updates, query, callback);
      },
      destroy: function(query, callback) {
        return this.scoped().destroy(query, callback);
      },
      deleteAll: function() {
        return this.scoped().deleteAll();
      },
      store: function(value) {
        if (!value && this._store) return this._store;
        if (typeof value === "object") {
          this._store || (this._store = new this.defaultStore({
            name: this.collectionName(),
            className: Metro.namespaced(this.name)
          }));
          Metro.Support.Object.extend(this._store, value);
        } else if (value) {
          this._store = value;
        }
        this._store || (this._store = new this.defaultStore({
          name: this.collectionName(),
          className: Metro.namespaced(this.name)
        }));
        return this._store;
      },
      defaultStore: Metro.Store.Memory,
      collectionName: function() {
        return Metro.Support.String.camelize(Metro.Support.String.pluralize(this.name), true);
      },
      resourceName: function() {
        return Metro.Support.String.camelize(this.name, true);
      },
      clone: function(model) {}
    },
    InstanceMethods: {
      isNew: function() {
        return !!!this.attributes.id;
      },
      save: function(callback) {
        if (this.isNew()) {
          return this._create(callback);
        } else {
          return this._update(this.toUpdates(), callback);
        }
      },
      _update: function(attributes, callback) {
        var _this = this;
        this.constructor.update(this.id, attributes, function(error) {
          if (!error) _this.changes = {};
          if (callback) return callback.call(_this, error);
        });
        return this;
      },
      _create: function(callback) {
        var _this = this;
        this.constructor.create(this.attributes, function(error, docs) {
          if (error) throw error;
          _this.changes = {};
          if (callback) return callback.call(_this, error);
        });
        return this;
      },
      updateAttributes: function(attributes, callback) {
        return this._update(attributes, callback);
      },
      "delete": function(callback) {
        var _this = this;
        if (this.isNew()) {
          if (callback) callback.apply(null, this);
        } else {
          this.constructor.destroy({
            id: this.id
          }, function(error) {
            if (!error) delete _this.attributes.id;
            if (callback) return callback.apply(_this, error);
          });
        }
        return this;
      },
      destroy: function(callback) {
        return this["delete"](function(error) {
          if (error) throw error;
          if (callback) return callback.apply(error, this);
        });
      },
      isPersisted: function() {
        return !!this.isNew();
      },
      toObject: function() {
        return this.attributes;
      },
      clone: function() {},
      reset: function() {},
      reload: function() {},
      toggle: function(name) {}
    }
  };

  Metro.Model.Atomic = {
    ClassMethods: {
      inc: function(attribute, amount) {
        if (amount == null) amount = 1;
      }
    },
    inc: function(attribute, amount) {
      if (amount == null) amount = 1;
    }
  };

  Metro.Model.Scopes = {
    ClassMethods: {
      scope: function(name, scope) {
        return this[name] = scope instanceof Metro.Model.Scope ? scope : this.where(scope);
      },
      scoped: function() {
        var scope;
        scope = new Metro.Model.Scope({
          model: this
        });
        if (this.baseClass().name !== this.name) {
          scope.where({
            type: this.name
          });
        }
        return scope;
      }
    }
  };

  _ref = Metro.Model.Scope.scopes;
  _fn = function(_key) {
    return Metro.Model.Scopes.ClassMethods[_key] = function() {
      var _ref2;
      return (_ref2 = this.scoped())[_key].apply(_ref2, arguments);
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    key = _ref[_i];
    _fn(key);
  }

  _ref2 = Metro.Model.Scope.finders;
  _fn2 = function(_key) {
    return Metro.Model.Scopes.ClassMethods[_key] = function() {
      var _ref3;
      return (_ref3 = this.scoped())[_key].apply(_ref3, arguments);
    };
  };
  for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
    key = _ref2[_j];
    _fn2(key);
  }

  Metro.Model.NestedAttributes = {
    ClassMethods: {
      acceptsNestedAttributesFor: function() {}
    },
    assignNestedAttributesForOneToOneAssociation: function(associationName, attributes, assignmentOpts) {
      if (assignmentOpts == null) assignmentOpts = {};
    },
    assignNestedAttributesForCollectionAssociation: function(associationName, attributesCollection, assignmentOpts) {
      if (assignmentOpts == null) assignmentOpts = {};
    }
  };

  Metro.Model.Serialization = {
    ClassMethods: {
      fromJSON: function(data) {
        var i, record, records, _len3;
        records = JSON.parse(data);
        if (!(records instanceof Array)) records = [records];
        for (i = 0, _len3 = records.length; i < _len3; i++) {
          record = records[i];
          records[i] = new this(record);
        }
        return records;
      },
      fromForm: function(data) {},
      fromXML: function(data) {},
      toJSON: function(records, options) {
        if (options == null) options = {};
        return JSON.stringify(records);
      }
    },
    toXML: function() {},
    toJSON: function(options) {
      return JSON.stringify(this._serializableHash(options));
    },
    toObject: function() {
      return this.attributes;
    },
    clone: function() {
      return new this.constructor(Metro.Support.Object.clone(this.attributes));
    },
    _serializableHash: function(options) {
      var attributeNames, except, i, include, includes, methodNames, methods, name, only, opts, record, records, result, tmp, _k, _l, _len3, _len4, _len5, _len6, _m;
      if (options == null) options = {};
      result = {};
      attributeNames = Metro.Support.Object.keys(this.attributes);
      if (only = options.only) {
        attributeNames = _.union(Metro.Support.Object.toArray(only), attributeNames);
      } else if (except = options.except) {
        attributeNames = _.difference(Metro.Support.Object.toArray(except), attributeNames);
      }
      for (_k = 0, _len3 = attributeNames.length; _k < _len3; _k++) {
        name = attributeNames[_k];
        result[name] = this._readAttributeForSerialization(name);
      }
      if (methods = options.methods) {
        methodNames = Metro.Support.Object.toArray(methods);
        for (_l = 0, _len4 = methods.length; _l < _len4; _l++) {
          name = methods[_l];
          result[name] = this[name]();
        }
      }
      if (includes = options.include) {
        includes = Metro.Support.Object.toArray(includes);
        for (_m = 0, _len5 = includes.length; _m < _len5; _m++) {
          include = includes[_m];
          if (!Metro.Support.Object.isHash(include)) {
            tmp = {};
            tmp[include] = {};
            include = tmp;
            tmp = void 0;
          }
          for (name in include) {
            opts = include[name];
            records = this[name]().all();
            for (i = 0, _len6 = records.length; i < _len6; i++) {
              record = records[i];
              records[i] = record._serializableHash(opts);
            }
            result[name] = records;
          }
        }
      }
      return result;
    },
    _readAttributeForSerialization: function(name, type) {
      if (type == null) type = "json";
      return this[name];
    }
  };

  Metro.Model.States = {};

  Metro.Model.Validator = (function() {

    Validator.create = function(name, value, attributes) {
      switch (name) {
        case "presence":
          return new this.Presence(name, value, attributes);
        case "count":
        case "length":
        case "min":
        case "max":
          return new this.Length(name, value, attributes);
        case "format":
          return new this.Format(name, value, attributes);
      }
    };

    function Validator(name, value, attributes) {
      this.name = name;
      this.value = value;
      this.attributes = attributes;
    }

    Validator.prototype.validateEach = function(record, errors) {
      var attribute, success, _k, _len3, _ref3;
      success = true;
      _ref3 = this.attributes;
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        attribute = _ref3[_k];
        if (!this.validate(record, attribute, errors)) success = false;
      }
      return success;
    };

    return Validator;

  })();

  Metro.Model.Validator.Format = (function() {

    function Format(value, attributes) {
      Format.__super__.constructor.call(this, value, attributes);
      this.value = typeof value === 'string' ? new RegExp(value) : value;
    }

    Format.prototype.validate = function(record, attribute, errors) {
      var value;
      value = record[attribute];
      if (!this.value.exec(value)) {
        errors[attribute] || (errors[attribute] = []);
        errors[attribute].push(Metro.t("model.errors.format", {
          attribute: attribute,
          value: this.value.toString()
        }));
        return false;
      }
      return true;
    };

    return Format;

  })();

  Metro.Model.Validator.Length = (function() {

    __extends(Length, Metro.Model.Validator);

    function Length(name, value, attributes) {
      Length.__super__.constructor.apply(this, arguments);
      this.validate = (function() {
        switch (name) {
          case "min":
            return this.validateMinimum;
          case "max":
            return this.validateMaximum;
          default:
            return this.validateLength;
        }
      }).call(this);
    }

    Length.prototype.validateMinimum = function(record, attribute, errors) {
      var value;
      value = record[attribute];
      if (!(typeof value === 'number' && value >= this.value)) {
        errors[attribute] || (errors[attribute] = []);
        errors[attribute].push(Metro.t("model.errors.minimum", {
          attribute: attribute,
          value: this.value
        }));
        return false;
      }
      return true;
    };

    Length.prototype.validateMaximum = function(record, attribute, errors) {
      var value;
      value = record[attribute];
      if (!(typeof value === 'number' && value <= this.value)) {
        errors[attribute] || (errors[attribute] = []);
        errors[attribute].push(Metro.t("model.errors.maximum", {
          attribute: attribute,
          value: this.value
        }));
        return false;
      }
      return true;
    };

    Length.prototype.validateLength = function(record, attribute, errors) {
      var value;
      value = record[attribute];
      if (!(typeof value === 'number' && value === this.value)) {
        errors[attribute] || (errors[attribute] = []);
        errors[attribute].push(Metro.t("model.errors.length", {
          attribute: attribute,
          value: this.value
        }));
        return false;
      }
      return true;
    };

    return Length;

  })();

  Metro.Model.Validator.Presence = (function() {

    __extends(Presence, Metro.Model.Validator);

    function Presence() {
      Presence.__super__.constructor.apply(this, arguments);
    }

    Presence.prototype.validate = function(record, attribute, errors) {
      if (!Metro.Support.Object.isPresent(record[attribute])) {
        errors[attribute] || (errors[attribute] = []);
        errors[attribute].push(Metro.t("model.errors.presence", {
          attribute: attribute
        }));
        return false;
      }
      return true;
    };

    return Presence;

  })();

  Metro.Model.Validator.Uniqueness = (function() {

    __extends(Uniqueness, Metro.Model.Validator);

    function Uniqueness() {
      Uniqueness.__super__.constructor.apply(this, arguments);
    }

    Uniqueness.prototype.validate = function(record, attribute, errors) {
      return true;
    };

    return Uniqueness;

  })();

  Metro.Model.Validations = {
    ClassMethods: {
      validate: function() {
        var attributes, key, options, validators, value, _results;
        attributes = Metro.Support.Array.args(arguments);
        options = attributes.pop();
        if (typeof options !== "object") {
          Metro.raise("missing_options", "" + this.name + ".validates");
        }
        validators = this.validators();
        _results = [];
        for (key in options) {
          value = options[key];
          _results.push(validators.push(Metro.Model.Validator.create(key, value, attributes)));
        }
        return _results;
      },
      validators: function() {
        return this._validators || (this._validators = []);
      }
    },
    validate: function() {
      var errors, success, validator, validators, _k, _len3;
      validators = this.constructor.validators();
      success = true;
      errors = this.errors = {};
      for (_k = 0, _len3 = validators.length; _k < _len3; _k++) {
        validator = validators[_k];
        if (!validator.validateEach(this, errors)) success = false;
      }
      return success;
    }
  };

  Metro.Model.Timestamp = {
    CreatedAt: {},
    UpdatedAt: {}
  };

  Metro.Model.include(Metro.Model.Persistence);

  Metro.Model.include(Metro.Model.Atomic);

  Metro.Model.include(Metro.Model.Versioning);

  Metro.Model.include(Metro.Model.Metadata);

  Metro.Model.include(Metro.Model.Dirty);

  Metro.Model.include(Metro.Model.Criteria);

  Metro.Model.include(Metro.Model.Scopes);

  Metro.Model.include(Metro.Model.States);

  Metro.Model.include(Metro.Model.Inheritance);

  Metro.Model.include(Metro.Model.Serialization);

  Metro.Model.include(Metro.Model.NestedAttributes);

  Metro.Model.include(Metro.Model.Relations);

  Metro.Model.include(Metro.Model.Validations);

  Metro.Model.include(Metro.Model.Callbacks);

  Metro.Model.include(Metro.Model.Fields);

}).call(this);
