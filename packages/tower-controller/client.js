
require('./shared');

require('./client/controller');

require('./client/actions');

require('./client/elements');

require('./client/events');

require('./client/handlers');

require('./client/instrumentation');

require('./client/states');

require('./client/flash');

Tower.Controller.include(Tower.ControllerActions);

Tower.Controller.include(Tower.ControllerElements);

Tower.Controller.include(Tower.ControllerEvents);

Tower.Controller.include(Tower.ControllerHandlers);

Tower.Controller.include(Tower.ControllerInstrumentation);

Tower.Controller.include(Tower.ControllerStates);

Tower.Controller.include(Tower.ControllerFlash);
