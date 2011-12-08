
  Metro.Controller.Resources = {
    ClassMethods: {
      resource: function(options) {
        if (options) this._resource = options;
        return this._resource;
      }
    },
    _create: function(callback) {},
    resource: function() {},
    collection: function() {},
    resourceClass: function() {},
    buildResource: function() {},
    createResource: function() {},
    updateResource: function() {},
    destroyResource: function() {},
    parent: function() {},
    endOfAssociationChain: function() {},
    associationChain: function() {}
  };

  module.exports = Metro.Controller.Resources;
