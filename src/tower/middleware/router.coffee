Tower.Middleware.Router = (request, response, callback) ->
  Tower.Middleware.Router.find request, response, (controller) ->
    if controller
      # need a more robust way to check if headers were sent
      unless response.statusCode == 302
        response.controller = controller
        response.writeHead(controller.status, controller.headers)
        response.write(controller.body)
        response.end()
      controller.clear()
    else
      Tower.Middleware.Router.error(request, response)
  
  response
  
Tower.Support.Object.extend Tower.Middleware.Router,  
  find: (request, response, callback) ->
    @processHost  request, response
    @processAgent request, response
    
    Tower.HTTP.Route.findController(request, response, callback)
  
  processHost: (request, response) ->
    request.location ||= new Tower.HTTP.Url(request.url)
  
  processAgent: (request, response) ->
    request.userAgent ||= request.headers["user-agent"] if request.headers
    
  error: (request, response) ->
    if response
      response.statusCode = 404
      response.setHeader('Content-Type', 'text/plain')
      response.end("No path matches #{request.url}")
      
module.exports = Tower.Middleware.Router
