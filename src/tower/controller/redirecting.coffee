Tower.Controller.Redirecting =
  redirectTo: ->
    @redirect arguments...
    
  redirect: ->
    @response.redirect arguments...
    
module.exports = Tower.Controller.Redirecting
