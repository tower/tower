class App.TestRoutesController extends Tower.Controller
  methods = [
    "get"
    "post"
    "put"
    "patch"
    "delete"
    "head"
    "getPost"
    "putPost"
  ]
  
  for method in methods
    proto = @::
    do (method, proto) ->
      proto["#{method}Method"] = ->
        @render text: "#{method}Method called"