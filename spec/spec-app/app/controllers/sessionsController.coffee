class CoachSpecApp.SessionsController extends Coach.Controller
  #@include Coach.View.Helpers
  
  new: ->
    @render text: "Login", layout: false
