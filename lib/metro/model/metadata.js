
  Metro.Model.Metadata = {
    ClassMethods: {
      baseClass: function() {},
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

  module.exports = Metro.Model.Metadata;
