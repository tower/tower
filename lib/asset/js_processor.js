var JsProcessor, Processor, exports;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Processor = require('./processor');
JsProcessor = (function() {
  __extends(JsProcessor, Processor);
  function JsProcessor() {
    JsProcessor.__super__.constructor.apply(this, arguments);
  }
  JsProcessor.prototype.extension = 'js';
  return JsProcessor;
})();
exports = module.exports = JsProcessor;