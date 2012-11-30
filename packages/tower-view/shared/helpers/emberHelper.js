var __slice = [].slice;

Tower.ViewEmberHelper = {
  hEach: function() {
    return hBlock.apply(null, ['each'].concat(__slice.call(arguments)));
  },
  hWith: function() {
    return hBlock.apply(null, ['with'].concat(__slice.call(arguments)));
  },
  hIf: function() {
    return hBlock.apply(null, ['if'].concat(__slice.call(arguments)));
  },
  hElse: function() {
    return text('{{else}}');
  },
  hUnless: function() {
    return hBlock.apply(null, ['unless'].concat(__slice.call(arguments)));
  },
  hView: function() {
    return hBlock.apply(null, ['view'].concat(__slice.call(arguments)));
  },
  hBindAttr: function() {
    return hAttr.apply(null, ['bindAttr'].concat(__slice.call(arguments)));
  },
  hAction: function() {
    return hAttr.apply(null, ['action'].concat(__slice.call(arguments)));
  },
  hAttr: function(key, string, options) {
    var k, v;
    if (typeof string === 'object') {
      options = string;
      string = "";
    } else {
      string = " \"" + string + "\"";
    }
    if (options) {
      for (k in options) {
        v = options[k];
        string += " " + k + "=\"" + v + "\"";
      }
    }
    return text("{{" + key + string + "}}");
  },
  hBlock: function(key, string, options, block) {
    var k, v;
    if (typeof options === 'function') {
      block = options;
      options = {};
    }
    options || (options = {});
    if (!_.isBlank(string)) {
      string = " " + string;
      for (k in options) {
        v = options[k];
        string += " " + k + "=\"" + v + "\"";
      }
    }
    text("{{#" + key + string + "}}" + (block ? "\n" : ""));
    if (block) {
      block();
      return text("{{/" + key + "}}");
    }
  }
};

module.exports = Tower.ViewEmberHelper;
