class App.PostsController extends Tower.Controller
  @layout "application"
  @param "likeCount"
  
  index: ->
    alert 'INDEX!'