class TowerSpecApp.SessionsController extends Tower.Controller
  #@include Tower.View.Helpers
  
  new: ->
    @render text: "Login", layout: false
