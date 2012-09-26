var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
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

Tower.ViewFormFieldset = (function(_super) {
  var ViewFormFieldset;

  ViewFormFieldset = __extends(ViewFormFieldset, _super);

  function ViewFormFieldset(args, options) {
    var attributes;
    ViewFormFieldset.__super__.constructor.apply(this, arguments);
    this.attributes = attributes = {};
    delete attributes.index;
    delete attributes.parentIndex;
    delete attributes.label;
    this.builder = new Tower.ViewFormBuilder([], {
      template: this.template,
      model: this.model,
      attribute: this.attribute,
      index: this.index,
      parentIndex: this.parentIndex,
      live: this.live
    });
  }

  __defineProperty(ViewFormFieldset,  "render", function(block) {
    var _this = this;
    return this.tag("fieldset", this.attributes, function() {
      if (_this.label) {
        _this.tag("legend", {
          "class": Tower.View.legendClass
        }, function() {
          return _this.tag("span", _this.label);
        });
      }
      return _this.tag(Tower.View.fieldListTag, {
        "class": Tower.View.fieldListClass
      }, function() {
        return _this.builder.render(block);
      });
    });
  });

  return ViewFormFieldset;

})(Tower.ViewComponent);

module.exports = Tower.ViewFormFieldset;
