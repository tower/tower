var CssProcessor, Processor, exports;
var __extends = function(child, parent) {
    var ctor = function(){};
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.prototype.constructor = child;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  };
Processor = require('./processor');
CssProcessor = function() {
  return Processor.apply(this, arguments);
};
__extends(CssProcessor, Processor);
CssProcessor.prototype.extension = 'css';
exports = (module.exports = CssProcessor);