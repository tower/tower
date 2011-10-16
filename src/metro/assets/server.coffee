# https://github.com/sstephenson/sprockets/blob/master/lib/sprockets/server.rb
class Server
  @middleware: (req, res, next) ->
    new Server.call(req, res, next)
  
  call: (req, res, next) ->
    start_time = new Date()
    asset      = @findAsset(req.path)
  
  forbiddenRequest: (req) ->
    false
    
  findAsset: (path) ->
    
module.exports = Server
