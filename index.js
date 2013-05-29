
if (global.__required__) {
  require('tower-cli').run(process.argv);
} else {
  module.exports = require('tower-server');
}
