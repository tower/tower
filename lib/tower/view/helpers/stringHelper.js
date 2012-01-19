
Tower.View.StringHelper = {
  t: function(string) {
    return Tower.translate(string);
  },
  l: function(object) {
    return Tower.localize(string);
  },
  boolean: function(boolean) {
    if (boolean) {
      return "yes";
    } else {
      return "no";
    }
  }
};

module.exports = Tower.View.StringHelper;
