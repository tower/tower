(function() {
  var Templates, exports;
  Templates = {
    Stylus: require('./templates/stylus'),
    Jade: require('./templates/jade'),
    Haml: require('./templates/haml'),
    Ejs: require('./templates/ejs'),
    CoffeeScript: require('./templates/coffee_script'),
    Less: require('./templates/less'),
    Mustache: require('./templates/mustache'),
    Sass: require('./templates/sass'),
    Markdown: require('./templates/markdown'),
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
    },
    engine: "jade"
  };
  exports = module.exports = Templates;
}).call(this);
