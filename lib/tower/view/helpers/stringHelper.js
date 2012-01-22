
Tower.View.StringHelper = {
  t: function(string) {
    return Tower.Support.I18n.translate(string);
  },
  l: function(object) {
    return Tower.Support.I18n.localize(string);
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
