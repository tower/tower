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
    Markdown: require('./compilers/markdown')
  };
  module.exports = Compilers;
}).call(this);
