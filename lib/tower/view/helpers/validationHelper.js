
Tower.View.ValidationHelper = {
  success: function() {
    return this.redirectTo(this.urlFor("admin", "categories"));
  },
  failure: function(error) {
    if (error) {
      return this.flashError(error);
    } else {
      return this.invalidate();
    }
  },
  invalidate: function() {
    var attribute, element, errors, field, _ref, _results;
    element = $("#" + this.resourceName + "-" + this.elementName);
    _ref = this.resource.errors;
    _results = [];
    for (attribute in _ref) {
      errors = _ref[attribute];
      field = $("#" + this.resourceName + "-" + attribute + "-field");
      if (field.length) {
        field.css("background", "yellow");
        _results.push($("input", field).after("<output class='error'>" + (errors.join("\n")) + "</output>"));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  }
};
