class MetroSpecApp.SessionsController extends MetroSpecApp.ApplicationController
  #@include Metro.View.Helpers
  
  new: ->
    @render text: "Login", layout: false
