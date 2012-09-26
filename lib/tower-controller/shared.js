
require('./shared/controller');

require('./shared/callbacks');

require('./shared/errors');

require('./shared/helpers');

require('./shared/instrumentation');

require('./shared/metadata');

require('./shared/params');

require('./shared/redirecting');

require('./shared/rendering');

require('./shared/resourceful');

require('./shared/responder');

require('./shared/responding');

require('./shared/scopes');

Tower.Controller.include(Tower.ControllerCallbacks);

Tower.Controller.include(Tower.ControllerErrors);

Tower.Controller.include(Tower.ControllerHelpers);

Tower.Controller.include(Tower.ControllerInstrumentation);

Tower.Controller.include(Tower.ControllerMetadata);

Tower.Controller.include(Tower.ControllerParams);

Tower.Controller.include(Tower.ControllerRedirecting);

Tower.Controller.include(Tower.ControllerRendering);

Tower.Controller.include(Tower.ControllerResourceful);

Tower.Controller.include(Tower.ControllerResponding);

Tower.Controller.include(Tower.ControllerScopes);
