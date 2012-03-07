class <%= app.namespace %>.ApplicationController extends Tower.Controller
  @layout "application"
  
  welcome: ->
    @render "welcome"
