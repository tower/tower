class SessionsController extends ApplicationController
  #@include Metro.View.Helpers
  
  new: ->
    @render text: "Login", layout: false
    
module.exports = SessionsController
