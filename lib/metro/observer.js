(function() {
  Metro.Observer = (function() {
    function Observer() {}
    return Observer;
  })();
  require('./observer/binding');
  module.exports = Metro.Observer;
}).call(this);
