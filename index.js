if ('undefined' !== typeof window) {
  module.exports = {};
} else {
  if (global.__required__) {
    require('tower-cli').run(process.argv);
  } else {
    module.exports = require('tower-server');
  }
}
