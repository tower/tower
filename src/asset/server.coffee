# https://github.com/sstephenson/sprockets/blob/master/lib/sprockets/server.rb
class Server
  call: (req, res, next) ->
    start_time = new Date()
    asset      = @findAsset(req.path)
  
  forbiddenRequest: (req) ->
    false
    
  findAsset: (path) ->
    
exports = module.exports = ->
  (req, res, next) ->
    new Server.call(req, res, next)
    