
require('./shared');

require('./shared/number');

require('./shared/geo');

try {
  _.string.isBlank = Tower.SupportObject;
} catch (_error) {}

require('./shared/callbacks');

require('./shared/shared');

require('./shared/class');

require('./shared/eventEmitter');

require('./shared/i18n');

require('./shared/url');

require('./shared/locale/en');

require('./shared/format');

require('./shared/factory');
