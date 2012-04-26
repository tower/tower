(function() {

  require('./controller/caching');

  require('./controller/events');

  require('./controller/http');

  require('./controller/sockets');

  Tower.Controller.include(Tower.Controller.Caching);

  Tower.Controller.include(Tower.Controller.Events);

  Tower.Controller.include(Tower.Controller.HTTP);

  Tower.Controller.include(Tower.Controller.Sockets);

  require('./controller/renderers');

}).call(this);
