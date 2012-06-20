class App.Address extends Tower.Model
  @field "coordinates", type: "Geo"
  @field "street"
  @field "city"
  @field "state"
  @field "zip"
  
  @belongsTo "addressible", polymorphic: true

  @belongsTo 'user'