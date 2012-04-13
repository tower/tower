class App.TestJsonController extends Tower.Controller
  methods = [
    "default"
    "post"
  ]
  
  for method in methods
    proto = @::
    do (method, proto) ->
      proto["#{method}Method"] = ->
        @respondTo (format) =>
          format.json => @render json: @params.data || {value: "#{method}Method in JSON"}
          format.html => @render text: "#{method}Method in HTML"