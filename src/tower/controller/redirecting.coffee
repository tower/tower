Tower.Controller.Redirecting =
  redirectTo: ->
    @redirect arguments...
    
  redirect: ->
    @response.redirect arguments...
    @callback() if @callback
    
module.exports = Tower.Controller.Redirecting
