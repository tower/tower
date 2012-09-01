_ = Tower._

Tower.MiddlewareRouter = (request, response, callback) ->
  if Tower.isInitialized
    Tower.MiddlewareRouter.render(request, response, callback)
  else
    Tower.Application.instance()._loadApp =>
      Tower.MiddlewareRouter.render(request, response, callback)

_.extend Tower.MiddlewareRouter,
  find: (request, response, callback) ->
    @processHost  request, response
    @processAgent request, response

    Tower.NetRoute.findController(request, response, callback)

  render: (request, response, callback) ->
    Tower.MiddlewareRouter.find request, response, (controller) ->
      if controller
        # need a more robust way to check if headers were sent
        Tower.Controller.testCase = controller if Tower.env == 'test'
        unless response.statusCode == 302
          response.controller = controller
          response.writeHead(controller.status, controller.headers)
          response.write(controller.body)
          response.end()
          controller.clear()
      else
        Tower.MiddlewareRouter.error(request, response)

    response

  processHost: (request, response) ->
    request.location ||= new Tower.NetUrl(request.url)

  processAgent: (request, response) ->
    request.userAgent ||= request.headers['user-agent'] if request.headers

  error: (request, response) ->
    if response
      response.statusCode = 404
      response.setHeader('Content-Type', 'text/plain')
      response.end("No path matches #{request.url}")

module.exports = Tower.MiddlewareRouter
