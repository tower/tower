class <%= project.className %>.ApplicationController extends Tower.Controller
  @layout "application"
  
  index: ->
    @render template: "index"
