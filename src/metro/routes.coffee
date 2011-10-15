Routes =
  Route:        require('./routes/route')
  Collection:   require('./routes/collection')
  Mapper:       require('./routes/mapper')
  
  bootstrap: ->
    require("#{Metro.root}/config/routes")
    
exports = module.exports = Routes
