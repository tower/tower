class App.Membership extends Tower.Model
  @field "kind"
  
  @belongsTo "group"
  @belongsTo "user"
  
  @belongsTo "joinable", polymorphic: true