(function() {
  var Compilers;
  Compilers = {
    Stylus: require('./compilers/stylus'),
    Jade: require('./compilers/jade'),
    Haml: require('./compilers/haml'),
    Ejs: require('./compilers/ejs'),
    CoffeeScript: require('./compilers/coffee_script'),
    Less: require('./compilers/less'),
    Mustache: require('./compilers/mustache'),
    Sass: require('./compilers/sass'),
    Markdown: require('./compilers/markdown'),
    engines: function() {
      var _ref;
      return (_ref = this._engines) != null ? _ref : this._engines = {
        "stylus": Metro.Compilers.Stylus,
        "jade": Metro.Compilers.Jade,
        "haml": Metro.Compilers.Haml,
        "ejs": Metro.Compilers.Ejs,
        "coffee": Metro.Compilers.CoffeeScript,
        "less": Metro.Compilers.Less,
        "sass": Metro.Compilers.Sass,
        "mustache": Metro.Compilers.Mustache
      };
    },
    engine: "jade"
  };
  module.exports = Compilers;
}).call(this);
