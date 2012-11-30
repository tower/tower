var _,
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

_ = Tower._;

Tower.Model = (function(_super) {
  var Model;

  function Model() {
    return Model.__super__.constructor.apply(this, arguments);
  }

  Model = __extends(Model, _super);

  Model.reopen(Ember.Evented);

  Model.reopen({
    errors: null,
    readOnly: false,
    previousChanges: void 0,
    initialize: function(attributes, options) {
      if (attributes == null) {
        attributes = {};
      }
      if (options == null) {
        options = {};
      }
      if (options.isNew !== false) {
        return this._initialize(attributes, options);
      } else {
        return this._initializeFromStore(attributes, options);
      }
    },
    _initialize: function(attributes, options) {
      _.extend(this.get('attributes'), this.constructor._defaultAttributes(this));
      this.assignAttributes(attributes);
      return this._initializeData(options);
    },
    _initializeFromStore: function(attributes, options) {
      _.extend(this.get('attributes'), this.constructor.initializeAttributes(this, attributes));
      this.set('isNew', false);
      return this._initializeData(options);
    },
    _initializeData: function(options) {
      this.setProperties({
        errors: {},
        readOnly: options.hasOwnProperty('readOnly') ? options.readOnly : false
      });
      this.runCallbacks('find');
      this.runCallbacks('initialize');
      return this;
    }
  });

  return Model;

})(Tower.Class);

module.exports = Tower.Model;
