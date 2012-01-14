
Tower.Generator.Resources = {
  route: function(routingCode) {
    var sentinel;
    this.log("route", routingCode);
    sentinel = /\.Route\.draw do(?:\s*\|map\|)?\s*$/;
    return this.inRoot(function() {
      return this.injectIntoFile('config/routes.rb', "\n  " + routing_code + "\n", {
        after: sentinel,
        verbose: false
      });
    });
  },
  nodeModule: function(name, options) {
    if (options == null) options = {};
  },
  locals: function() {
    return {
      model: this.model
    };
  },
  attribute: function(name, type) {
    if (type == null) type = "string";
    return {
      name: name,
      type: type,
      humanName: _.titleize(name),
      fieldType: (function() {
        switch (type) {
          case "integer":
            return "numberField";
          case "float":
          case "decimal":
            return "textField";
          case "time":
            return "timeSelect";
          case "datetime":
          case "timestamp":
            return "datetimeSelect";
          case "date":
            return "dateSelect";
          case "text":
            return "textArea";
          case "boolean":
            return "checkBox";
          default:
            return "textField";
        }
      })(),
      "default": (function() {
        switch (type) {
          case "integer":
            return 1;
          case "float":
            return 1.5;
          case "decimal":
            return "9.99";
          case "datetime":
          case "timestamp":
          case "time":
            return Time.now.toString("db");
          case "date":
            return Date.today.toString("db");
          case "string":
            if (name === "type") {
              return "";
            } else {
              return "MyString";
            }
          case "text":
            return "MyText";
          case "boolean":
            return false;
          case "references":
          case "belongsTo":
            return null;
          default:
            return "";
        }
      })()
    };
  },
  model: function(name, namespace) {
    var attributes, className, cssName, humanName, namespacedClassName, pair, pluralClassName, pluralCssName, pluralName, type, _i, _len;
    if (this.model) return this.model;
    name = Tower.Support.String.camelize(name, true);
    namespace = namespace;
    className = Tower.Support.String.camelize(name);
    pluralClassName = Tower.Support.String.pluralize(this.className);
    namespacedClassName = "" + namespace + "." + this.className;
    pluralName = Tower.Support.String.pluralize(this.name);
    cssName = Tower.Support.String.parameterize(this.name);
    pluralCssName = Tower.Support.String.parameterize(this.pluralName);
    humanName = _.titleize(this.className);
    attributes = [];
    for (_i = 0, _len = argv.length; _i < _len; _i++) {
      pair = argv[_i];
      pair = pair.split(":");
      name = pair[0];
      type = Tower.Support.String.camelize(pair[1] || pair[0], true);
      attributes.push(new Tower.Generator.Attribute(name, Tower.Support.String.camelize(type)));
    }
    return this.model = {
      name: name,
      namespace: namespace,
      className: className,
      pluralClassName: pluralClassName,
      namespacedClassName: namespacedClassName,
      pluralName: pluralName,
      cssName: cssName,
      pluralCssName: pluralCssName,
      humanName: humanName,
      attributes: attributes
    };
  }
};

module.exports = Tower.Generator.Resources;
