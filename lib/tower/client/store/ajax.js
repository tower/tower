var __defineStaticProperty = function(clazz, key, value) {
  if(typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend();
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Store.Ajax = (function(_super) {
  var Ajax, sync;

  Ajax = __extends(Ajax, _super);

  __defineStaticProperty(Ajax,  "requests", []);

  __defineStaticProperty(Ajax,  "enabled", true);

  __defineStaticProperty(Ajax,  "pending", false);

  function Ajax() {
    Ajax.__super__.constructor.apply(this, arguments);
    this.deleted = {};
  }

  __defineStaticProperty(Ajax,  "defaults", {
    contentType: 'application/json',
    dataType: 'json',
    processData: false,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  __defineStaticProperty(Ajax,  "ajax", function(params, defaults) {
    return $.ajax($.extend({}, this.defaults, defaults, params));
  });

  __defineStaticProperty(Ajax,  "toJSON", function(record, method, format) {
    var data;
    data = {};
    data[Tower.Support.String.camelize(record.constructor.name, true)] = record;
    data._method = method;
    data.format = format;
    return JSON.stringify(data);
  });

  __defineStaticProperty(Ajax,  "disable", function(callback) {
    if (this.enabled) {
      this.enabled = false;
      callback();
      return this.enabled = true;
    } else {
      return callback();
    }
  });

  __defineStaticProperty(Ajax,  "requestNext", function() {
    var next;
    next = this.requests.shift();
    if (next) {
      return this.request(next);
    } else {
      return this.pending = false;
    }
  });

  __defineStaticProperty(Ajax,  "request", function(callback) {
    var _this = this;
    return (callback()).complete(function() {
      return _this.requestNext();
    });
  });

  __defineStaticProperty(Ajax,  "queue", function(callback) {
    if (!this.enabled) {
      return;
    }
    if (this.pending) {
      this.requests.push(callback);
    } else {
      this.pending = true;
      this.request(callback);
    }
    return callback;
  });

  __defineProperty(Ajax,  "success", function(record, options) {
    var _this = this;
    if (options == null) {
      options = {};
    }
    return function(data, status, xhr) {
      var _ref;
      Ajax.disable(function() {
        if (data && !_.isBlank(data)) {
          return record.updateAttributes(data, {
            sync: false
          });
        }
      });
      return (_ref = options.success) != null ? _ref.apply(_this.record) : void 0;
    };
  });

  __defineProperty(Ajax,  "failure", function(record, options) {
    var _this = this;
    if (options == null) {
      options = {};
    }
    return function(xhr, statusText, error) {
      var _ref;
      return (_ref = options.error) != null ? _ref.apply(record) : void 0;
    };
  });

  __defineProperty(Ajax,  "queue", function(callback) {
    return this.constructor.queue(callback);
  });

  __defineProperty(Ajax,  "request", function() {
    var _ref;
    return (_ref = this.constructor).request.apply(_ref, arguments);
  });

  __defineProperty(Ajax,  "ajax", function() {
    var _ref;
    return (_ref = this.constructor).ajax.apply(_ref, arguments);
  });

  __defineProperty(Ajax,  "toJSON", function() {
    var _ref;
    return (_ref = this.constructor).toJSON.apply(_ref, arguments);
  });

  __defineProperty(Ajax,  "create", function(criteria, callback) {
    var _this = this;
    if (criteria.sync !== false) {
      return Ajax.__super__[ "create"].call(this, criteria, function(error, records) {
        if (callback) {
          callback.call(_this, error, records);
        }
        return _this.createRequest(records, options);
      });
    } else {
      return Ajax.__super__[ "create"].apply(this, arguments);
    }
  });

  __defineProperty(Ajax,  "update", function(updates, criteria, callback) {
    var _this = this;
    if (criteria.sync === true) {
      return Ajax.__super__[ "update"].call(this, updates, criteria, function(error, result) {
        if (callback) {
          callback.call(_this, error, result);
        }
        return _this.updateRequest(result, options);
      });
    } else {
      return Ajax.__super__[ "update"].apply(this, arguments);
    }
  });

  __defineProperty(Ajax,  "destroy", function(criteria, callback) {
    var _this = this;
    if (criteria.sync !== false) {
      return Ajax.__super__[ "destroy"].call(this, criteria, function(error, result) {
        _this.destroyRequest(result, criteria);
        if (callback) {
          return callback.call(_this, error, result);
        }
      });
    } else {
      return Ajax.__super__[ "destroy"].apply(this, arguments);
    }
  });

  __defineProperty(Ajax,  "createRequest", function(records, options) {
    var json,
      _this = this;
    if (options == null) {
      options = {};
    }
    json = this.toJSON(records);
    Tower.urlFor(records.constructor);
    return this.queue(function() {
      var params;
      params = {
        url: url,
        type: "POST",
        data: json
      };
      return _this.ajax(options, params).success(_this.createSuccess(records)).error(_this.createFailure(records));
    });
  });

  __defineProperty(Ajax,  "createSuccess", function(record) {
    var _this = this;
    return function(data, status, xhr) {
      var id;
      id = record.id;
      record = _this.find(id);
      _this.records[data.id] = record;
      delete _this.records[id];
      return record.updateAttributes(data);
    };
  });

  __defineProperty(Ajax,  "createFailure", function(record) {
    return this.failure(record);
  });

  __defineProperty(Ajax,  "updateRequest", function(record, options, callback) {
    var _this = this;
    return this.queue(function() {
      var params;
      params = {
        type: "PUT",
        data: _this.toJSON(record)
      };
      return _this.ajax({}, params).success(_this.updateSuccess(record)).error(_this.updateFailure(record));
    });
  });

  __defineProperty(Ajax,  "updateSuccess", function(record) {
    var _this = this;
    return function(data, status, xhr) {
      record = Tower.constant(_this.className).find(record.id);
      return record.updateAttributes(data);
    };
  });

  __defineProperty(Ajax,  "updateFailure", function(record) {
    var _this = this;
    return function(xhr, statusText, error) {};
  });

  __defineProperty(Ajax,  "destroyRequest", function(record, criteria) {
    var _this = this;
    return this.queue(function() {
      var params, url;
      if (_.isArray(record)) {
        record = record[0];
      }
      url = Tower.urlFor(record);
      params = {
        url: url,
        type: 'POST',
        data: JSON.stringify({
          format: 'json',
          _method: 'DELETE'
        })
      };
      return _this.ajax({}, params).success(_this.destroySuccess(record)).error(_this.destroyFailure(record));
    });
  });

  __defineProperty(Ajax,  "destroySuccess", function(data) {
    var _this = this;
    return function(data, status, xhr) {
      return delete _this.deleted[data.id];
    };
  });

  __defineProperty(Ajax,  "destroyFailure", function(record) {
    var _this = this;
    return function(xhr, statusText, error) {};
  });

  __defineProperty(Ajax,  "findRequest", function(options) {
    var _this = this;
    return this.queue(function() {
      var params;
      params = {
        type: "GET",
        data: _this.toJSON(record)
      };
      return _this.ajax({}, params).success(_this.findSuccess(options)).error(_this.findFailure(options));
    });
  });

  __defineProperty(Ajax,  "findSuccess", function(options) {
    var _this = this;
    return function(data, status, xhr) {
      if (_.isPresent(data)) {
        return _this.load(data);
      }
    };
  });

  __defineProperty(Ajax,  "findFailure", function(record) {
    var _this = this;
    return function(xhr, statusText, error) {};
  });

  __defineProperty(Ajax,  "findOneRequest", function(options, callback) {
    var _this = this;
    return this.queue(function() {
      var params;
      params = {
        type: "GET",
        data: _this.toJSON(record)
      };
      return _this.ajax({}, params).success(_this.findSuccess(options)).error(_this.findFailure(options));
    });
  });

  __defineProperty(Ajax,  "findOneSuccess", function(options) {
    var _this = this;
    return function(data, status, xhr) {};
  });

  __defineProperty(Ajax,  "findOneFailure", function(options) {
    var _this = this;
    return function(xhr, statusText, error) {};
  });

  sync = function() {
    var _this = this;
    return this.all(function(error, records) {
      var changes, record, _i, _len;
      changes = {
        create: [],
        update: [],
        destroy: []
      };
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        if (record.syncAction) {
          changes[record.syncAction].push(record);
        }
      }
      if (changes.create != null) {
        _this.createRequest(changes.create);
      }
      if (changes.update != null) {
        _this.updateRequest(changes.update);
      }
      if (changes.destroy != null) {
        _this.destroyRequest(changes.destroy);
      }
      return true;
    });
  };

  __defineProperty(Ajax,  "refresh", function() {});

  __defineProperty(Ajax,  "fetch", function() {});

  return Ajax;

})(Tower.Store.Memory);
