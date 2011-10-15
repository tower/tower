(function() {
  var CssProcessor, exports;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  CssProcessor = (function() {
    __extends(CssProcessor, require('./processor'));
    function CssProcessor() {
      CssProcessor.__super__.constructor.apply(this, arguments);
    }
    CssProcessor.prototype.extension = 'css';
    return CssProcessor;
  })();
  exports = module.exports = CssProcessor;
}).call(this);
