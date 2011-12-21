
  Tower.Model.Metadata = {
    ClassMethods: {
      baseClass: function() {
        if (this.__super__ && this.__super__.constructor.baseClass && this.__super__.constructor !== Tower.Model) {
          return this.__super__.constructor.baseClass();
        } else {
          return this;
        }
      },
      stiName: function() {},
      toParam: function() {
        return Tower.Support.String.parameterize(this.className());
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

  module.exports = Tower.Model.Metadata;
