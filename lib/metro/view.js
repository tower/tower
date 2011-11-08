(function() {
  Metro.View = (function() {
    function View(controller) {
      this.controller = controller || (new Metro.Controller);
    }
    return View;
  })();
  require('./view/helpers');
  require('./view/lookup');
  require('./view/rendering');
  Metro.View.include(Metro.View.Lookup);
  Metro.View.include(Metro.View.Rendering);
  module.exports = Metro.View;
}).call(this);
