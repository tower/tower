(function() {
  var Template, exports;
  Template = {
    Stylus: require('./template/stylus'),
    Jade: require('./template/jade'),
    Haml: require('./template/haml'),
    Ejs: require('./template/ejs'),
    CoffeeScript: require('./template/coffee_script'),
    Less: require('./template/less'),
    Mustache: require('./template/mustache'),
    Sass: require('./template/sass'),
    Markdown: require('./template/markdown'),
    engines: function() {
      var _ref;
      return (_ref = this._engines) != null ? _ref : this._engines = {
        "stylus": Metro.Template.Stylus,
        "jade": Metro.Template.Jade,
        "haml": Metro.Template.Haml,
        "ejs": Metro.Template.Ejs,
        "coffee": Metro.Template.CoffeeScript,
        "less": Metro.Template.Less,
        "sass": Metro.Template.Sass,
        "mustache": Metro.Template.Mustache
      };
    }
  };
  exports = module.exports = Template;
}).call(this);
