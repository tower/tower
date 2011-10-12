var JsProcessor, Processor, exports;
var __extends = function(child, parent) {
    var ctor = function(){};
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.prototype.constructor = child;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  };
Processor = require('./processor');
JsProcessor = function() {
  return Processor.apply(this, arguments);
};
__extends(JsProcessor, Processor);
JsProcessor.prototype.extension = 'js';
exports = (module.exports = JsProcessor);