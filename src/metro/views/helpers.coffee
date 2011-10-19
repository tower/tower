# https://github.com/rails/rails/tree/master/actionpack/lib/action_view/helpers
# https://github.com/masahiroh/express-helpers
# http://tjholowaychuk.com/post/7590787973/jade-mixins-includes
class Helpers
  #["form", "table"].each ->
  #  klass = "Metro.Components.#{this.toUpperCase()}"
  #  @::["#{this}_for"] = -> global[klass].new(arguments...).render()
    
  stylesheet_link_tag: (source) ->
    "<link href=\"#{@asset_path(source, directory: Metro.Assets.stylesheet_directory, ext: "css")}\"></link>"
    
  asset_path: (source, options = {}) ->
    if options.digest == undefined
      options.digest = !!Metro.env.match(/(development|test)/) 
    Metro.Application.assets().compute_public_path(source, options)
    
  javascript_include_tag: (path) ->
    
  title_tag: (title) ->
    "<title>#{title}</title>"
    
  meta_tag: (name, content) ->
    
  tag: (name, options) ->
  
  link_tag: (title, path, options) ->
    
  image_tag: (path, options) ->
    
module.exports = Helpers  
