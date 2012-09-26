
Tower.ControllerActions = {
  index: function(params) {
    var _this = this;
    return this.findCollection(function(error, collection) {
      return _this.render('index');
    });
  },
  "new": function() {
    var _this = this;
    return this.buildResource(function(error, resource) {
      return _this.render('new');
    });
  },
  create: function(callback) {
    var _this = this;
    return this.createResource(function(error, resource) {
      if (!resource) {
        return _this.failure(error);
      }
    });
  },
  show: function() {
    var _this = this;
    return this.findResource(function(error, resource) {
      if (error) {
        return _this.failure(error);
      }
      return _this.render('show');
    });
  },
  edit: function() {
    var _this = this;
    return this.findResource(function(error, resource) {
      if (error) {
        return _this.failure(error);
      }
      return _this.render('edit');
    });
  },
  update: function() {
    var _this = this;
    return this.updateResource(function(error, resource) {
      if (error) {
        return _this.failure(error);
      }
      return _this.redirectTo('show');
    });
  },
  save: function() {},
  destroy: function() {
    var _this = this;
    return this.destroyResource(function(error, resource) {
      if (error) {
        return _this.failure(error);
      }
      return _this.redirectTo('index');
    });
  }
};
