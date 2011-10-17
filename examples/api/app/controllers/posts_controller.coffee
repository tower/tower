class PostsController
  @include  Metro.Controllers.Base
  
  #@layout   "application"
  @layout   false
  
  t: (string) ->
    @_t ?= require("#{Metro.root}/config/locales/en")
    @_t[string]
    
  index: ->
    #@render layout: false, json: hello: 'world'
    @render json: hello: 'world'
    #@render "posts/index"
    #@respond_with hello: 'world'

module.exports = PostsController
