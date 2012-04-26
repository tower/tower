
Tower.View.StringHelper = {
  HTML_ESCAPE: {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  },
  preserve: function(text) {
    return text.replace(/\n/g, '&#x000A;').replace(/\r/g, '');
  },
  htmlEscape: function(text) {
    var _this = this;
    return text.replace(/[\"><&]/g, function(_) {
      return _this.HTML_ESCAPE[_];
    });
  },
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
