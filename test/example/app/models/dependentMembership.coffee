class App.DependentMembership extends Tower.Model
  @field "kind"
  
  @belongsTo "group"
  @belongsTo "user"