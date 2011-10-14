class Dispatcher
  @middleware: (req, res, next) ->
    (new Dispatcher).call(req, res, next)
  
  call: (req, res, next) ->
    console.log "CALLED"
    renderer = new Metro.View.Renderer
    body = renderer.render("#{Metro.root}/app/views/posts/index", type: "jade")
    res.setHeader('Content-Length', body.length)
    res.end(body)
    next()
    
exports = module.exports = Dispatcher
