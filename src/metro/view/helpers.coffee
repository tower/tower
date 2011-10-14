# https://github.com/rails/rails/tree/master/actionpack/lib/action_view/helpers
# https://github.com/masahiroh/express-helpers
# http://tjholowaychuk.com/post/7590787973/jade-mixins-includes
class Helpers
  ["form", "table"].each ->
    klass = "Metro.Components.#{this.toUpperCase()}"
    @::["#{this}_for"] = -> global[klass].new(arguments...).render()