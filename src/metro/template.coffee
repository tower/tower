Template =
  Stylus:         require('./template/stylus')
  Jade:           require('./template/jade')
  Haml:           require('./template/haml')
  Ejs:            require('./template/ejs')
  CoffeeScript:   require('./template/coffee_script')
  Less:           require('./template/less')
  # Scss:           require('./template/scss')
  Mustache:       require('./template/mustache')
  Sass:           require('./template/sass')
  Markdown:       require('./template/markdown')
  
  engines: ->
    @_engines ?= {
      "stylus": Metro.Template.Stylus
      "jade":   Metro.Template.Jade
      "haml":   Metro.Template.Haml
      "ejs":    Metro.Template.Ejs
      "coffee":    Metro.Template.CoffeeScript
      "less":    Metro.Template.Less
      #"scss":    Metro.Template.Scss
      "sass":    Metro.Template.Sass
      "mustache":    Metro.Template.Mustache
    }
  
exports = module.exports = Template
