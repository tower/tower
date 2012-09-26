
require('./shared');

require('./server/queue');

require('./server/sync');

Tower.Model.include(Tower.ModelQueue);
