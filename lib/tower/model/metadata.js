
Tower.Model.Metadata = {
  ClassMethods: {
    baseClass: function() {
      if (this.__super__ && this.__super__.constructor.baseClass && this.__super__.constructor !== Tower.Model) {
        return this.__super__.constructor.baseClass();
      } else {
        return this;
      }
    },
    toParam: function() {
      return Tower.Support.String.pluralize(Tower.Support.String.parameterize(this.name));
    },
    toKey: function() {
      return Tower.Support.String.parameterize(this.name);
    },
    url: function(options) {
      var url;
      return this._url = (function() {
        switch (typeof options) {
          case "object":
            if (options.parent) {
              return url = "/" + (Tower.Support.String.parameterize(Tower.Support.String.pluralize(options.parent))) + "/:" + (Tower.Support.String.camelize(options.parent, true)) + "/" + (this.toParam());
            }
            break;
          default:
            return options;
        }
      }).call(this);
    }
  },
  toLabel: function() {
    return this.className();
  },
  toPath: function() {
    var param, result;
    result = this.constructor.toParam();
    param = this.toParam();
    if (param) return result += "/" + param;
  },
  toParam: function() {
    var id;
    id = this.get("id");
    if (id) {
      return String(id);
    } else {
      return null;
    }
  },
  toKey: function() {
    return this.constructor.tokey();
  }
};

module.exports = Tower.Model.Metadata;
