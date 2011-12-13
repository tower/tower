(function() {

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

  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __slice = Array.prototype.slice;

  Metro.Model.Scope = (function() {

    __extends(Scope, Metro.Object);

    function Scope(sourceClassName) {
      this.sourceClassName = sourceClassName;
      this.conditions = [];
    }

    Scope.prototype.where = function() {
      this.conditions.push(["where", arguments]);
      return this;
    };

    Scope.prototype.order = function() {
      this.conditions.push(["order", arguments]);
      return this;
    };

    Scope.prototype.limit = function() {
      this.conditions.push(["limit", arguments]);
      return this;
    };

    Scope.prototype.select = function() {
      this.conditions.push(["select", arguments]);
      return this;
    };

    Scope.prototype.joins = function() {
      this.conditions.push(["joins", arguments]);
      return this;
    };

    Scope.prototype.includes = function() {
      this.conditions.push(["includes", arguments]);
      return this;
    };

    Scope.prototype.paginate = function() {
      this.conditions.push(["paginate", arguments]);
      return this;
    };

    Scope.prototype.within = function() {
      this.conditions.push(["within", arguments]);
      return this;
    };

    Scope.prototype.find = function() {
      var callback, ids, options, query, _i, _ref, _ref2;
      ids = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), callback = arguments[_i++];
      _ref = this._translateConditions(), query = _ref.query, options = _ref.options;
      return (_ref2 = this.store()).find.apply(_ref2, __slice.call(ids).concat([query], [options], [callback]));
    };

    Scope.prototype.all = function(callback) {
      var options, query, _ref;
      _ref = this._translateConditions(), query = _ref.query, options = _ref.options;
      return this.store().all(query, options, callback);
    };

    Scope.prototype.first = function(callback) {
      var options, query, _ref;
      _ref = this._translateConditions(), query = _ref.query, options = _ref.options;
      return this.store().first(callback);
    };

    Scope.prototype.last = function(callback) {
      var options, query, _ref;
      _ref = this._translateConditions(), query = _ref.query, options = _ref.options;
      return this.store().last(callback);
    };

    Scope.prototype.build = function(attributes, callback) {
      var options, query, _ref;
      _ref = this._translateConditions(), query = _ref.query, options = _ref.options;
      attributes = Metro.Support.Object.extend(query, attributes);
      return this.store().build(options, attributes, callback);
    };

    Scope.prototype.create = function(attributes, callback) {
      var options, query, _ref;
      _ref = this._translateConditions(), query = _ref.query, options = _ref.options;
      attributes = Metro.Support.Object.extend(query, attributes);
      return this.store().create(options, attributes, callback);
    };

    Scope.prototype.update = function() {
      var callback, ids, options, query, updates, _i, _ref, _ref2;
      ids = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), updates = arguments[_i++], callback = arguments[_i++];
      _ref = this._translateConditions(), query = _ref.query, options = _ref.options;
      return (_ref2 = this.store()).update.apply(_ref2, __slice.call(ids).concat([query], [options], [callback]));
    };

    Scope.prototype.updateAll = function(updates, callback) {
      var options, query, _ref;
      _ref = this._translateConditions(), query = _ref.query, options = _ref.options;
      return this.store().updateAll(updates, query, options, callback);
    };

    Scope.prototype["delete"] = function() {
      var callback, ids, options, query, _i, _ref, _ref2;
      ids = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), callback = arguments[_i++];
      _ref = this._translateConditions(), query = _ref.query, options = _ref.options;
      return (_ref2 = this.store())["delete"].apply(_ref2, __slice.call(ids).concat([query], [options], [callback]));
    };

    Scope.prototype.deleteAll = function(callback) {
      var options, query, _ref;
      _ref = this._translateConditions(), query = _ref.query, options = _ref.options;
      return this.store().deleteAll(query, options, callback);
    };

    Scope.prototype.destroy = function() {
      var callback, ids, options, query, _i, _ref, _ref2;
      ids = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), callback = arguments[_i++];
      _ref = this._translateConditions(), query = _ref.query, options = _ref.options;
      return (_ref2 = this.store()).destroy.apply(_ref2, __slice.call(ids).concat([query], [options], [callback]));
    };

    Scope.prototype.destroyAll = function(callback) {
      var options, query, _ref;
      _ref = this._translateConditions(), query = _ref.query, options = _ref.options;
      return this.store().destroyAll(query, options, callback);
    };

    Scope.prototype._createQuery = function() {
      var condition, conditions, item, key, query, store, value, _i, _len;
      conditions = this.conditions;
      query = {};
      store = this.store();
      for (_i = 0, _len = conditions.length; _i < _len; _i++) {
        condition = conditions[_i];
        switch (condition[0]) {
          case "where":
            item = condition[1][0];
            for (key in item) {
              value = item[key];
              query[key] = value;
            }
            break;
          case "order":
            options.sort = condition[1][0];
        }
      }
      return {
        query: query,
        options: options
      };
    };

    Scope.prototype._translateUpdateAttributes = function(attributes) {};

    Scope.prototype.store = function() {
      return this.model().store();
    };

    Scope.prototype.model = function() {
      return Metro.constant(this.sourceClassName);
    };

    return Scope;

  })();

  module.exports = Metro.Model.Scope;

}).call(this);
