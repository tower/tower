(function() {
  var filter, _i, _len, _ref;

  _ref = ["stylus", "less", "markdown"];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    filter = _ref[_i];
    this[filter] = function(text) {
      return Tower.View.render(text, {
        filter: filter
      });
    };
  }

}).call(this);
