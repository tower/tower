class App.SessionsController extends Tower.Controller
  new: ->
    @render text: "Login", layout: false
