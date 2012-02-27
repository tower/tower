
require('./controller/elements');

require('./controller/events');

require('./controller/handlers');

Tower.Controller.include(Tower.Controller.Elements);

Tower.Controller.include(Tower.Controller.Events);

Tower.Controller.include(Tower.Controller.Handlers);
