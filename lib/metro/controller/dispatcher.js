(function() {
  var Dispatcher, exports;
  Dispatcher = (function() {
    function Dispatcher() {}
    Dispatcher.middleware = function(req, res, next) {
      return (new Dispatcher).call(req, res, next);
    };
    Dispatcher.prototype.call = function(req, res, next) {
      var body, renderer;
      console.log("CALLED");
      renderer = new Metro.View.Renderer;
      body = renderer.render("" + Metro.root + "/app/views/posts/index", {
        type: "jade"
      });
      res.setHeader('Content-Length', body.length);
      res.end(body);
      return next();
    };
    return Dispatcher;
  })();
  exports = module.exports = Dispatcher;
}).call(this);
