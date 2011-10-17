# https://github.com/sstephenson/sprockets/blob/master/lib/sprockets/server.rb
class Assets
  @middleware: (req, res, next) ->
    new Assets.call(req, res, next)
  
  call: (req, res, next) ->
    start_time = new Date()
    asset      = @findAsset(req.path)
  
  forbiddenRequest: (req) ->
    false
    
  findAsset: (path) ->
    
module.exports = Assets
