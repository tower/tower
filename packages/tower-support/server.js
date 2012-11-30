
require('./shared');

require('./shared/file');

if (!Tower.isNew) {
  require('./shared/number');
  require('./shared/geo');
}

require('./shared/callbacks');

require('./shared/shared');

require('./shared/class');

if (!Tower.isNew) {
  require('./shared/eventEmitter');
  require('./shared/i18n');
  require('./shared/url');
  require('./shared/locale/en');
  require('./shared/format');
  require('./shared/factory');
}
