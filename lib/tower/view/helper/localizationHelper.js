
Tower.View.LocalizationHelper = {
  t: function(string) {
    return Tower.translate(string);
  },
  l: function(object) {
    return Tower.localize(string);
  }
};

module.exports = Tower.View.LocalizationHelper;
