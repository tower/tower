(function() {
  var Templates;
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
    Resolver: require('./templates/resolver'),
    engines: function() {
      var _ref;
      return (_ref = this._engines) != null ? _ref : this._engines = {
        "stylus": Metro.Templates.Stylus,
        "jade": Metro.Templates.Jade,
        "haml": Metro.Templates.Haml,
        "ejs": Metro.Templates.Ejs,
        "coffee": Metro.Templates.CoffeeScript,
        "less": Metro.Templates.Less,
        "sass": Metro.Templates.Sass,
        "mustache": Metro.Templates.Mustache
      };
    },
    engine: "jade"
  };
  module.exports = Templates;
}).call(this);
