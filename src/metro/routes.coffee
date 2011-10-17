Routes =
  Route:        require('./routes/route')
  Collection:   require('./routes/collection')
  Mapper:       require('./routes/mapper')
  
  bootstrap: ->
    require("#{Metro.root}/config/routes")
    
  reload: ->
    delete require.cache["#{Metro.root}/config/routes"]
    Metro.Application._routes = null
    @bootstrap()
    
module.exports = Routes
