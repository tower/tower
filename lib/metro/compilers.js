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
    Sprite: require('./compilers/sprite'),
    find: function(key) {
      return this.keys()[key];
    },
    keys: function() {
      var _ref;
      return (_ref = this._keys) != null ? _ref : this._keys = {
        "styl": new Metro.Compilers.Stylus,
        "jade": new Metro.Compilers.Jade,
        "haml": new Metro.Compilers.Haml,
        "ejs": new Metro.Compilers.Ejs,
        "coffee": new Metro.Compilers.CoffeeScript,
        "less": new Metro.Compilers.Less,
        "sass": new Metro.Compilers.Sass,
        "mustache": new Metro.Compilers.Mustache
      };
    }
  };
  module.exports = Compilers;
}).call(this);
