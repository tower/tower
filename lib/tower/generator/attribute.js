
Tower.Generator.Attribute = (function() {

  function Attribute(name, type) {
    if (type == null) type = "string";
    this.name = name;
    this.type = type;
  }

  Attribute.prototype.fieldType = function() {
    return this.fieldType || (this.fieldType = (function() {
      switch (this.type) {
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
    }).call(this));
  };

  Attribute.prototype["default"] = function() {
    return this["default"] || (this["default"] = (function() {
      switch (this.type) {
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
    }).call(this));
  };

  Attribute.prototype.humanName = function() {
    return this.name.humanize();
  };

  Attribute.prototype.isReference = function() {
    return this.type["in"](["references", "belongsTo"]);
  };

  return Attribute;

})();

module.exports = Tower.Generator.Attribute;
