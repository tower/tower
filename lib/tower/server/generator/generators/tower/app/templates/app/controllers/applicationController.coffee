class <%= app.namespace %>.ApplicationController extends Tower.Controller
  @layout "application"
  
  @beforeAction "bootstrap"#, only: "welcome"
  
  welcome: ->
    @render "welcome", locals: {@bootstrapData}
  
  # Example of how you might bootstrap a one-page application.
  bootstrap: (callback) ->
    data = @bootstrapData = {}
    
    # for every model you add, you can add it to the bootstrap dataset by using this async helper.
    _.series [
    ], callback