var _;

_ = Tower._;

Tower.ControllerActions = {
  index: function() {
    var _this = this;
    return this._index(function(format) {
      format.html(function() {
        return _this.render('index');
      });
      return format.json(function() {
        return _this.render({
          json: _this.collection,
          status: 200
        });
      });
    });
  },
  "new": function() {
    var _this = this;
    return this._new(function(format) {
      format.html(function() {
        return _this.render('new');
      });
      return format.json(function() {
        return _this.render({
          json: _this.resource,
          status: 200
        });
      });
    });
  },
  create: function(callback) {
    var _this = this;
    return this._create(function(format) {
      format.html(function() {
        return _this.redirectTo({
          action: 'show'
        });
      });
      return format.json(function() {
        return _this.render({
          json: _this.resource,
          status: 201
        });
      });
    });
  },
  show: function() {
    var _this = this;
    return this._show(function(format) {
      format.html(function() {
        return _this.render('show');
      });
      return format.json(function() {
        return _this.render({
          json: _this.resource,
          status: 200
        });
      });
    });
  },
  edit: function() {
    var _this = this;
    return this._edit(function(format) {
      format.html(function() {
        return _this.render('edit');
      });
      return format.json(function() {
        return _this.render({
          json: _this.resource,
          status: 200
        });
      });
    });
  },
  update: function() {
    var _this = this;
    return this._update(function(format) {
      format.html(function() {
        return _this.redirectTo({
          action: 'show'
        });
      });
      return format.json(function() {
        return _this.render({
          json: _this.resource,
          status: 200
        });
      });
    });
  },
  destroy: function() {
    var _this = this;
    return this._destroy(function(format) {
      format.html(function() {
        return _this.redirectTo({
          action: 'index'
        });
      });
      return format.json(function() {
        return _this.render({
          json: _this.resource,
          status: 200
        });
      });
    });
  },
  _index: function(callback) {
    var _this = this;
    return this.findCollection(function(error, collection) {
      return _this.respondWith(collection, callback);
    });
  },
  _new: function(callback) {
    var _this = this;
    return this.buildResource(function(error, resource) {
      if (!resource) {
        return _this.failure(error);
      }
      return _this.respondWith(resource, callback);
    });
  },
  _create: function(callback) {
    var _this = this;
    return this.createResource(function(error, resource) {
      if (!resource) {
        return _this.failure(error, callback);
      }
      return _this.respondWithStatus(_.isBlank(resource.errors), callback);
    });
  },
  _show: function(callback) {
    var _this = this;
    return this.findResource(function(error, resource) {
      return _this.respondWith(resource, callback);
    });
  },
  _edit: function(callback) {
    var _this = this;
    return this.findResource(function(error, resource) {
      return _this.respondWith(resource, callback);
    });
  },
  _update: function(callback) {
    var _this = this;
    return this.findResource(function(error, resource) {
      if (error) {
        return _this.failure(error, callback);
      }
      return resource.updateAttributes(_this.params[_this.resourceName], function(error) {
        return _this.respondWithStatus(!!!error && _.isBlank(resource.errors), callback);
      });
    });
  },
  _destroy: function(callback) {
    var _this = this;
    return this.findResource(function(error, resource) {
      if (error) {
        return _this.failure(error, callback);
      }
      return resource.destroy(function(error) {
        return _this.respondWithStatus(!!!error, callback);
      });
    });
  }
};
