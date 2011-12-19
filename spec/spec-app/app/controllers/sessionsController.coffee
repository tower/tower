class CoachSpecApp.SessionsController extends CoachSpecApp.ApplicationController
  #@include Coach.View.Helpers
  
  new: ->
    @render text: "Login", layout: false
